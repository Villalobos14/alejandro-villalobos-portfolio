import type { MotifDefinition, MotifType } from "../types";
import { data } from "./data";
import { jelly } from "./jelly";
import { lily } from "./lily";
import { manta } from "./manta";
import { yuta } from "./yuta";

export const MOTIFS: Record<MotifType, MotifDefinition> = { manta, jelly, lily, yuta, data };
