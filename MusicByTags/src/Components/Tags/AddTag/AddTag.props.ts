import { Track } from "../../../interfaces/Track.interface";

export interface AddTagProps {
    track: Track;
    type?: "small" | "big";
}