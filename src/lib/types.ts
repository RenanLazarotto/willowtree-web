export type ByteOrder = 'little' | 'big'
export type Platform = 'pc' | 'ps3' | 'xbox'
export type VehicleType = 0 | 1 // 0 = rocket, 1 = machine gun

export type ChallengeDataEntry = {
    id: number;
    typeId: number;
    value: number;
}

/*

        public struct ChallengeDataEntry
        {
            public Int16 Id;
            public Byte TypeId;
            public Int32 Value;
        }
            */