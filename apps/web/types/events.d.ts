// import { $Enums } from "@prisma/client";

type UserEvent = {
  id: string;
  title: string;
  description: string;
  type: string;
  location: string;
  startTime: Date;
  endTime: Date;
  alarmTime: Date;
  status: $Enums.EventStatus;
  userId: string;
  arenaId?: string;
  arena?: {
    title: string;
    colorCode: string;
  };
};
