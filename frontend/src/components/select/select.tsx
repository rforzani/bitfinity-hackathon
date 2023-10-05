import styles from "./select.module.css";
import { MdArrowDropUp, MdArrowDropDown, MdOutlineCancel } from "react-icons/md";
import { useEffect, useState, useRef } from "react";

type SelectOption = {
    value: string;
    label: string;
}

type SelectProps = {
    placeholder?: string;
    value: string;
    options: SelectOption[];
    className?: string;
    isSearchable?: boolean;
    noValuesMsg?: string;
    isTree?: boolean;
    groupBy?: string;
    isClearable?: boolean;
    isEditable?: boolean;
    onChange: (opt: string | Array<any>) => void;
}

export function Select({className, value, placeholder, options, isSearchable, noValuesMsg, isTree, groupBy, isClearable, isEditable, onChange} : SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [groupedOptions, setGroupedOptions] = useState<any>();
    const [filteredOptions, setFilteredOptions] = useState<Array<SelectOption>>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState<any>({});
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let foundOption = options.find(opt => opt.value === value);
        setSelectedValue(foundOption ? foundOption.label : "");
    }, [value]);

    useEffect(() => {
        if (isTree && groupBy) {
            if (isSearchable) {
                setGroupedOptions(groupByElement(filteredOptions, (item : any) => item[groupBy as string]) as any);
            } else {
                setGroupedOptions(groupByElement(options, (item : any) => item[groupBy as string]) as any);
            }
        }
    }, [filteredOptions, options]);

    useEffect(() => {
        const handleClickOutside = (e: any) => {
          if (ref.current && !ref.current.contains(e.target)) {
            setIsOpen(false);
          }
        };
        document.addEventListener('click', handleClickOutside, true);
        return () => {
          document.removeEventListener('click', handleClickOutside, true);
        };
      }, []);

      useEffect(() => {
        if (isSearchable && options) {
            if (!searchValue) {
                if (selectedValue) {
                    let reArrangedOptions = options;
                    let frontElement = reArrangedOptions.find(opt => opt.label === selectedValue);
                    reArrangedOptions = reArrangedOptions.filter(item => item.label !== selectedValue);
                    reArrangedOptions.unshift(frontElement as SelectOption);
                    setFilteredOptions(reArrangedOptions);
                } else {
                    setFilteredOptions(options);
                }
            } else {
                setFilteredOptions(options.filter(opt => opt.label.toLowerCase().includes(searchValue)));
            }
        }
      }, [searchValue, options]);

    useEffect(() => {
        if (isSearchable && options) {
            if (selectedValue) {
                let reArrangedOptions = options;
                let frontElement = reArrangedOptions.find(opt => opt.label === selectedValue);
                reArrangedOptions = reArrangedOptions.filter(item => item.label !== selectedValue);
                reArrangedOptions.unshift(frontElement as SelectOption);
                setFilteredOptions(reArrangedOptions);
            }
        }
    }, [selectedValue]);

    const selectOption = (opt: SelectOption) => {
        setIsOpen(false);
        setSearchValue("");
        if (opt.value !== selectedValue) {
            if (isTree && groupBy) {
                let option : any = opt;
                onChange([option[groupBy], opt.value]);
            } else {
                onChange(opt.value);
            }
        }
    };

    function groupByElement(list : Array<any>, keyGetter : any) {
        const map = new Map();
        list.forEach((item) => {
             const key = keyGetter(item);
             const collection = map.get(key);
             if (!collection) {
                 map.set(key, [item]);
             } else {
                 collection.push(item);
             }
        });
        return map;
    }

    function isDropdownEditable() {
        if (isEditable || isEditable === undefined) {
            return true;
        } else {
            return false;
        }
    }

    const displayTreeOptions = (
        <>
            {groupedOptions && Array.from(groupedOptions).map((group : any, i : number) => {
                return (
                    <div key={group[0]}>
                        <div className={styles.parentOption} onClick={() => setIsDropdownOpen({...isDropdownOpen, [group[0]]: !isDropdownOpen[group[0]]})}>
                            {group[0]}
                            <div style={{marginLeft: "auto"}}>
                                {isDropdownOpen[group[0]] ? <MdArrowDropUp /> : <MdArrowDropDown />}
                            </div>
                        </div>
                        <div style={{display: isDropdownOpen[group[0]] ? "block" : "none"}}>
                            {group[1].map((opt : any, i : number) => {
                                if (opt) {
                                    return <li key={opt.label + i} className={styles.childOption} style={opt.label === selectedValue ? {backgroundColor: "rgb(235,235,235)"} : {}} onClick={() => selectOption(opt)}>{opt.label}</li>   
                                }
                            })}
                        </div>
                    </div>
                );
            })}
        </>
    );

    const optionsElement = (
        <ul className={styles.options}>
            {isSearchable && <li className={styles.searchOption}><input type="text" className={styles.searchInput} value={searchValue} placeholder="Search..." onChange={(e) => setSearchValue(e.target.value.toLowerCase())} /></li>}
            {options && options.length > 0 ?
                isSearchable ?
                    filteredOptions.length > 0 ?
                        isTree ?
                            displayTreeOptions
                        :
                            filteredOptions.map((opt : SelectOption, i) => {
                                if (opt) {
                                    return <li key={opt.label} className={styles.option} style={opt.label === selectedValue ? {backgroundColor: "rgb(235,235,235)"} : {}} onClick={() => selectOption(opt)}>{opt.label}</li>
                                }
                            })
                    :
                        <li className={styles.notFoundOption}>No results found</li>
                :
                    isTree ?
                        displayTreeOptions
                    :
                        options.map((opt : SelectOption, i) => (
                            <li key={opt.label} className={styles.option} style={opt.label === selectedValue ? {backgroundColor: "rgb(235,235,235)"} : {}} onClick={() => selectOption(opt)}>{opt.label}</li>
                        ))
            :
                noValuesMsg ?
                    <li className={styles.notFoundOption}>{noValuesMsg}</li>
                :
                    <li className={styles.notFoundOption}>No options found</li>
            }
        </ul>
    );

    return (
        <div ref={ref} className={`${styles.outerContainer} ${className}`}>
            <div className={styles.container} style={isOpen ? {borderColor: "rgb(0, 127, 217)"} : {cursor: isDropdownEditable() ? "pointer": "not-allowed"}} onClick={() => isDropdownEditable() && setIsOpen(!isOpen)}>
                {selectedValue ? <div className={styles.value}>{selectedValue}</div> : <div className={styles.placeholder}>{placeholder}</div>}
                {isDropdownEditable() &&
                    <>
                        {isClearable && selectedValue && <MdOutlineCancel color="red" className={styles.cancelSelection} onClick={(e : any) => {e.stopPropagation(); onChange("");}} />}
                        {isOpen ? <MdArrowDropUp className={styles.arrow} /> : <MdArrowDropDown className={styles.arrow} />}
                    </>
                }
            </div>
            {isOpen && optionsElement}
        </div>
    );
}