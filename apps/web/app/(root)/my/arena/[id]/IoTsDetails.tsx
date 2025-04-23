"use client";

export default ({
  assignedIoTs,
}: {
  assignedIoTs: IoTIds[];
}) => {
 
  return (
    <div className="container mt-4">
      <label className="flex text-gray-800 font-semibold dark:text-white">
        Assigned IoTs
      </label>
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

    </div>
  );
};
