import { Currencies } from '../../constants/currencies';

export type WalletsState = {
    [key in Currencies]: number
}

export type HadlersType = (state: WalletsState, action: any) => WalletsState