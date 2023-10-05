# NexaChallenge README

NexaChallenge is a revolutionary decentralized platform designed to transform the way freelancers and companies collaborate. With the power of smart contracts, NexaChallenge enables secure, transparent, and unbiased project assignments, creating a level playing field where talent can shine. This README provides an overview of NexaChallenge's key features, target audience, problem-solving capabilities, and vision.

## Table of Contents
- [Features](#features)
- [Target Audience](#target-audience)
- [Problem Solving](#problem-solving)
- [Vision Statement](#vision-statement)
- [Getting Started](#getting-started)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
    - [Deployment](#deployment)
    - [Configurations](#configurations)

---

## Features

### 1. Smart Contract-Backed Projects
- Companies can set budgets and deadlines through smart contracts, ensuring transparency and commitment to project terms.

### 2. Limited Competitions
- A maximum of 5 freelancers can compete for each project, streamlining the selection process for companies and improving the chances of quality work.

### 3. Direct Payouts
- Upon project completion and review, funds are automatically released to the winning freelancer, eliminating payment delays and ensuring prompt compensation.

### 4. Enhanced Opportunity for Starters
- New freelancers gain access to projects without the need for extensive reviews, fostering growth and providing them with a fair chance to showcase their skills.

### 5. Secure Escrow System
- Funds are held in escrow, guaranteeing that companies have sufficient funds for the project and providing security for both freelancers and companies.

---

## Target Audience

NexaChallenge caters to two primary user groups:

### 1. Freelancers
- Freelancers seeking fair opportunities to showcase their skills and compete on a level playing field.
- Newcomers to the freelance industry looking for a platform to kickstart their careers.

### 2. Companies
- Companies seeking streamlined project collaboration with freelancers.
- Organizations looking for a transparent and efficient platform to find talent and execute projects.

---

## Problem Solving

NexaChallenge addresses several critical issues within the freelancing industry:

### 1. Lack of Reviews for Starters
- Provides a platform for new freelancers to showcase their skills and compete with experienced professionals, overcoming the initial hurdle of building a portfolio.

### 2. Bias-Free Selection
- Removes bias in freelancer selection by maintaining anonymity until after the competition, ensuring that freelancers are judged solely on their skills and work quality.

### 3. Direct Fund Assurance
- Companies are required to have sufficient funds in escrow for projects, guaranteeing that freelancers receive timely payment for their work, and preventing payment disputes.

### 4. Streamlined Process
- Limits the number of competing freelancers to 5, making project selection more efficient for companies, reducing the time and effort required for decision-making.

---

## Vision Statement

**Empowering freelancers and companies through a decentralized platform that redefines collaboration, creating a fair, transparent, and efficient ecosystem for project assignments.**

---

## Getting Started

Follow these steps to set up and run the project:

### Backend Setup

1. Open your terminal or command prompt.
2. Navigate to the backend directory using the `cd` command:

```bash
cd backend
```

3. Install the required dependencies:

```bash
npm install
```

4. Start the backend server:

```bash
npm run dev
```

### Frontend Setup

1. Open a new terminal window.
2. Navigate to the frontend directory using the `cd` command:

```bash
cd frontend
```

3. Install the required dependencies:

```bash
npm install
```

4. Start the frontend:

```bash
npm start
```

### Deployment

To deploy the smart contract, follow these steps:

1. Open the Remix IDE (https://remix.ethereum.org/).
2. Paste your smart contract code into the editor.
3. Select the correct Solidity version and compiler settings.
4. Click on the "Solidity Compiler" tab, then click "Compile [ContractName]".
5. Switch to the "Deploy & Run Transactions" tab.
6. Select the environment "Injected Web3"
7. Click on "Deploy" to deploy the smart contract.
8. Note the deployed contract address.

### Configurations

Update the following configurations in the respective files:

#### 1. MongoDB URL

Navigate to the `config` directory and open the `config.js` file. Locate the `mongoURL` field and replace it with your own MongoDB URL.

```javascript
module.exports = {
  // ...
  mongoURL: 'mongodb://your-mongodb-url...', // Update with your MongoDB URL
  // ...
};
```

#### 2. Smart Contract Address

Navigate to the `config` directory and open the `config.js` file. Locate the `contractAddress` field and replace it with the newly deployed contract address.

```javascript
module.exports = {
  // ...
  contractAddress: '0x123456789abcdef...', // Update with your contract address
  // ...
};

---

**For Developers:** 

We welcome your feedback, contributions, and ideas to make NexaChallenge even better!

For inquiries, contact us at nexachallenge@gmail.com

