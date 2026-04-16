import Image from "next/image";
import IoTsDetails from "./IoTsDetails";
import SettingButton from "./SettingButton";
import { ArenaDataDisplay } from "./ArenaDataDisplay";

export default ({
  arenaIdx,
  arenaData,
  assignedIoTsData,
  arenaSpecificActivity,
}: {
  arenaIdx: number;
  arenaData: ArenaDetails;
  assignedIoTsData: IotInfo[];
  arenaSpecificActivity: ArenaSpecificActivity;
}) => {
  return (
    <>
      <div className="absolute right-0.5 md:right-[4.6rem] top-[16rem]">
        <SettingButton isEditable={arenaData.isReal} arenaIdx={arenaData.idx} />
      </div>
      <input id="idx" name="idx" className="hidden" defaultValue={arenaIdx} />
      <Image
        src={arenaData.image}
        alt="Arena Avatar"
        className="w-full h-56 object-cover rounded-lg shadow-lg mb-12"
        width={600}
        height={400}
      />

      <ArenaDataDisplay label="Name" value={arenaData.title} />
      <ArenaDataDisplay label="Location" value={arenaData.location} />
      <ArenaDataDisplay label="Description" value={arenaData.description} />
      <ArenaDataDisplay label="Area (in acres)" value={arenaData.area} />
      <ArenaDataDisplay label="Soil type" value={arenaData.soilType} />
      <ArenaDataDisplay label="Current crop" value={arenaData.currentCrop} />

      <IoTsDetails assignedIoTs={assignedIoTsData} />

      {/* {!isEditing && (
          <DataLinks arenaIdx={arenaIdx} arenaDataCount={arenaSpecificActivity} />
        )} */}
    </>
  );
};
