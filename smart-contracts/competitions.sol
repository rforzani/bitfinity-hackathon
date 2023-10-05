//SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.0;

contract Competitions {
       enum CompetitionStatus {
        Open,
        Closed,
        WinnerSelected
    }
    struct Competition {
        string title;
        uint256 submissionLimit;
        uint256 prize;
        address payable winner;
        address creator;
        address[] submissions;
        CompetitionStatus status;
        uint256  index;
    }

    Competition[] public competitions;

    uint256 counter = 0;

    event CompetitionCreated(uint256 indexed index, string indexed title);

    function createCompetition(
        string memory title,
        uint256 submissionLimit
    ) public payable {
        competitions.push(
            Competition({
                title: title,
                submissionLimit: submissionLimit,
                prize: msg.value,
                winner: payable(address(0)),
                creator: msg.sender,
                submissions: new address[](0),
                status: CompetitionStatus.Open,
                index: counter
            })
        );
        counter++;

        emit CompetitionCreated(counter - 1, title);
    }

    function submitWork (uint256 competitionId) public {
        Competition storage competition = competitions[competitionId];
        require(competition.status == CompetitionStatus.Open, "Competition is not open");
        require(competition.submissions.length < competition.submissionLimit, "Competition is full");
        competition.submissions.push(msg.sender);
    }

    function pickWinner (uint256 competitionId, address payable winner) public {
        Competition storage competition = competitions[competitionId];
        require(competition.creator == msg.sender, "Only the creator can pick a winner");
        require(competition.status == CompetitionStatus.Open, "Competition is not open");
        uint isPresent = 0;
        for (uint256 i = 0; i<competition.submissions.length; i++) {
            if (competition.submissions[i] == winner) {
                isPresent = 1;
                break;
            }
        }
        require(isPresent == 1, "Winner is not a participant");

        competition.winner = winner;
        competition.status = CompetitionStatus.WinnerSelected;

        winner.transfer(competition.prize);
    }
}