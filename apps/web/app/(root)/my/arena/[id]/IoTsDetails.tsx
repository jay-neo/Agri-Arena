"use client";

import { myenv } from "~/lib/myenv";
import { getAvailableIoTs } from "~/app/server/iot";
import { fakeAvailableIoTs } from "~/test/data/faker";
import { useState, useEffect, KeyboardEvent, MouseEvent } from "react";

export default ({
  isEditing,
  assignedIoTs,
  rejectedIoTs,
  setAssignedIoTs,
  setRejectedIoTs,
}: {
  isEditing: boolean;
  assignedIoTs: IoTIds[];
  rejectedIoTs: IoTIds[];
  setAssignedIoTs: React.Dispatch<React.SetStateAction<IoTIds[]>>;
  setRejectedIoTs: React.Dispatch<React.SetStateAction<IoTIds[]>>;
}) => {
  const [isActive, setIsActive] = useState(false);
  const [availableIoTs, setAvailableIoTs] = useState<IoTIds[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredIoTs, setFilteredIoTs] = useState<IoTIds[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      if (isEditing) {
        const availableIoTsData =
          myenv === "test" ? fakeAvailableIoTs : await getAvailableIoTs();
        setAvailableIoTs(availableIoTsData);
        setFilteredIoTs(availableIoTsData);
      }
    })();
  }, [isEditing]);

  const fetchAvailableIoTs = async (searchTerm: string): Promise<IoTIds[]> => {
    if (availableIoTs) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            availableIoTs.filter((iot: IoTIds) =>
              iot.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
          );
        }, 500);
      });
    }
  };

  useEffect(() => {
    if (searchTerm) {
      fetchAvailableIoTs(searchTerm).then(setFilteredIoTs);
    } else {
      setFilteredIoTs(availableIoTs); // Show all available IoTs if search term is empty
    }
  }, [searchTerm, availableIoTs]);

  const handleIoTSelection = (iot: IoTIds) => {
    if (!assignedIoTs.includes(iot)) {
      setAssignedIoTs([...assignedIoTs, iot]);
      setAvailableIoTs(availableIoTs.filter((available) => available !== iot));
    }
    setSearchTerm("");
    setFilteredIoTs(availableIoTs);
    setSelectedIndex(null);
    setIsActive(false);
  };

  const handleIoTRemoval = (iot: IoTIds) => {
    setAssignedIoTs(assignedIoTs.filter((assigned) => assigned !== iot));
    setRejectedIoTs([...rejectedIoTs, iot]);
    setAvailableIoTs([...availableIoTs, iot]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (filteredIoTs && filteredIoTs.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault(); // Prevent default scrolling behavior
        setSelectedIndex((prevIndex) =>
          prevIndex === null || prevIndex === filteredIoTs.length - 1
            ? 0
            : prevIndex + 1
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex === null || prevIndex === 0
            ? filteredIoTs.length - 1
            : prevIndex - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIndex !== null) {
          handleIoTSelection(filteredIoTs[selectedIndex]);
        }
      }
    }
  };

  const handleDropdownClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent default behavior when clicking inside dropdown
    e.stopPropagation(); // Stop event propagation to prevent onBlur from firing
  };

  return (
    <div className="container mt-4">
      <label className="flex text-gray-800 font-semibold dark:text-white">
        Assigned IoTs
      </label>
      {isEditing ? (
        <>
          <div className="container flex flex-wrap max-w-full">
            {assignedIoTs &&
              assignedIoTs.map((iot) => (
                <div
                  key={iot.device}
                  className="relative max-w-full border-2 border-lime-600 dark:text-white rounded-full px-8 py-2 text-sm font-semibold mr-2 mb-2"
                >
                  {iot.title}
                  <div className="text-gray-400/90 dark:text-sky-200 truncate">
                    {iot.device}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleIoTRemoval(iot)}
                    className="absolute -top-1 -right-2 bg-red-500/90 hover:bg-red-600 text-white rounded-full px-2 py-1 text-xs font-extrabold"
                  >
                    &times;
                  </button>
                </div>
              ))}
          </div>
          <input
            type="text"
            name="assigned_iots"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsActive(true);
            }}
            placeholder="Search here your iot"
            onKeyDown={handleKeyDown}
            onFocus={() => setIsActive(true)}
            autoComplete="off"
            className={`text-gray-900 text-sm rounded-md focus:ring-lime-500 focus:border-lime-500 block w-full ps-3 p-2.5 dark:text-white bg-slate-300 dark:bg-sky-600/30 border border-gray-300 dark:border-gray-600`}
          />
          {isActive && (
            <div
              className="mt-2 max-h-48 overflow-y-auto scrollbar-hide"
              onMouseDown={handleDropdownClick}
            >
              {filteredIoTs.length > 0 ? (
                filteredIoTs.map((iot, index) => (
                  <div
                    key={iot.id}
                    className={`container md:flex md:justify-between cursor-pointer bg-gray-200 p-2 rounded-2xl mb-2 dark:bg-teal-800/60  ${
                      index === selectedIndex
                        ? "bg-gray-300 dark:bg-teal-800/60 border border-teal-300"
                        : ""
                    }`}
                    onClick={() => handleIoTSelection(iot)}
                  >
                    <div>{iot.title}</div>
                    <div className="text-gray-300 dark:text-sky-200 truncate">
                      {iot.device}
                    </div>
                  </div>
                ))
              ) : (
                <div className="container md:flex md:justify-between cursor-pointer bg-gray-200 p-2 rounded-2xl mb-2 dark:bg-teal-800/60">
                  No IoT found
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="mb-6">
          {assignedIoTs.length > 0 ? (
            <div className="mt-2 flex flex-wrap">
              {assignedIoTs.map((iot) => (
                <span
                  key={iot.id}
                  className="relative inline-block border-2 border-lime-600 dark:text-white rounded-full px-8 py-2 text-sm font-semibold mr-2 mb-2"
                >
                  {iot.title}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-lime-700 dark:text-lime-500 flex md:block  items-center justify-center">
              No IoTs are assigned!!
            </span>
          )}
        </div>
      )}
    </div>
  );
};
