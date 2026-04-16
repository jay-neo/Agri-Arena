import { Cpu, Leaf, Ruler, Trees, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import { getFormattedDate } from "~/lib/formatters/date";

export const ArenaPreview = async ({ arena }: { arena: ArenaOverview }) => {
  const fields = [
    {
      icon: <MapPin className="w-4 h-4" />,
      value: arena.location,
      condition: !!arena.location,
    },
    {
      icon: <Trees className="w-4 h-4" />,
      value: `${arena.currentCrop}`,
      condition: !!arena.currentCrop,
    },
    {
      icon: <Ruler className="w-4 h-4" />,
      value: `${arena.area} acres area`,
      condition: !!arena.area,
    },
    {
      icon: <Leaf className="w-4 h-4" />,
      value: `${arena.soilType}`,
      condition: !!arena.soilType,
    },
    {
      icon: <Cpu className="w-4 h-4" />,
      value: `${arena.iots} deployed IoT${`${arena.iots > 1 ? "s" : ""}`}`,
      condition: !!arena.iots,
    },
  ];

  return (
    <div className="w-96 h-60 mx-2 mb-6">
      <Link
        href={`arena/${arena.idx}`}
        className="block h-full rounded-xl bg-sky-200/80 dark:bg-white/5 p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:bg-sky-300/80 dark:hover:bg-white/10"
      >
        <div className="h-full flex flex-col">
          <h3 className="text-xl font-semibold line-clamp-1 mb-2">
            {arena.title}
          </h3>

          <div className="flex-1 space-y-2">
            {fields
              .filter((f) => f.condition)
              .map((field, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="mt-0.5 text-sky-700 dark:text-rose-100">
                    {field.icon}
                  </div>
                  <p className="text-sm dark:text-rose-100 line-clamp-1">
                    {field.value}
                  </p>
                </div>
              ))}
          </div>

          <div className="flex items-center justify-end gap-2 mt-2 text-sm dark:text-rose-100">
            <Calendar className="w-4 h-4" />
            <span>{getFormattedDate(arena.updatedAt)}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};
