type IotInfo = {
    id: string;
    title: string;
    device: string;
};

type IotDetails = {
    id: string;
    title: string;
    device: string;
    interval: number;
    location?: string;
    createdAt: Date;
    status?: string;
    arena?: string;
    arenaId?: string;
    arenaLocation?: string;
    description?: string;
};

type IoT = {
    id: string;
    title: string;
    device: string;
    interval: number;
    location?: string;
    description?: string;
    arena?: string;
    arenaId?: string;
    arenaLocation?: string;
};