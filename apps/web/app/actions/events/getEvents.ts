"use server";

import { db } from "~/lib/prisma";
import { getUser } from "../user";

export const getEvents = async (scope?: string) => {
  try {
    const user = await getUser();

    // If no scope is provided, default to current month
    const now = new Date();
    const defaultMonth = now.getMonth() + 1; // 1-12
    const defaultYear = now.getFullYear();
    const month: number = scope
      ? parseInt(scope.slice(0, 2), 10)
      : defaultMonth;
    const year: number = scope ? parseInt(scope.slice(-4), 10) : defaultYear;

    let prevScope: string, nextScope: string;
    switch (month) {
      case 1:
        prevScope = `12${year - 1}`;
        nextScope = `0${month + 1}${year}`;
        break;
      case 2 - 8:
        prevScope = `0${month - 1}${year}`;
        nextScope = `0${month + 1}${year}`;
        break;
      case 9 - 10:
        prevScope = `0${month - 1}${year}`;
        nextScope = `${month + 1}${year}`;
        break;
      case 11:
        prevScope = `${month - 1}${year}`;
        nextScope = `${month + 1}${year}`;
        break;
      case 12:
        prevScope = `${month - 1}${year}`;
        nextScope = `01${year + 1}`;
        break;
    }

    // Validate month and year
    if (month < 1 || month > 12 || year < 1000 || year > 9999) {
      throw new Error("Invalid scope format");
    }

    // Calculate date range: previous month to next month
    const startOfPrevMonth = new Date(year, month - 2, 1); // Previous month
    const endOfNextMonth = new Date(year, month, 0, 23, 59, 59, 999); // End of next month

    const events = await db.event.findMany({
      where: {
        userId: user.id,
        OR: [
          {
            startTime: {
              gte: startOfPrevMonth,
              lte: endOfNextMonth,
            },
          },
          {
            endTime: {
              gte: startOfPrevMonth,
              lte: endOfNextMonth,
            },
          },
          {
            AND: [
              { startTime: { lte: endOfNextMonth } },
              { endTime: { gte: startOfPrevMonth } },
            ],
          },
          {
            AND: [
              { startTime: { not: null } },
              { endTime: null },
              { startTime: { gte: startOfPrevMonth } },
            ],
          },
          {
            AND: [
              { startTime: null },
              { endTime: { not: null } },
              { endTime: { lte: endOfNextMonth } },
            ],
          },
        ],
      },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        location: true,
        startTime: true,
        endTime: true,
        alarmTime: true,
        status: true,
        userId: true,
        arenaId: true,
        arena: {
          select: {
            title: true,
            colorCode: true,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return {
      eventsScope: [prevScope, scope, nextScope],
      events: events as UserEvent[],
    };
  } catch (error) {
    console.error("Error fetching events:", error);
    return { eventsScope: [], events: [] };
  }
};
