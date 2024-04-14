import { useDispatch, useSelector } from "react-redux";
import styles from "./Track.module.css";
import { AppDispatch, RootState } from "../../../Store/store";
import { activeManagerActions } from "../../../Store/CurrentTrackStateSlices/activeManager.slice";
import cn from "classnames";
import { Reorder } from "framer-motion";
import { TrackItemProps } from "./Track.props";
import { PlayerActions } from "../../../Store/CurrentTrackStateSlices/playerManager.slice";
import AddTag from "../../Tags/AddTag/AddTag";
import Popup from "reactjs-popup";
import TagBlock from "../../Tags/TagBlock/TagBlock";

function TrackItem({ track, list, className, index, focusActive }: TrackItemProps) {
    const dispatch = useDispatch<AppDispatch>();
    const currentTrack = useSelector((s: RootState) => s.player.currentTrack);
    const activeManager = useSelector((s: RootState) => s.activeManager);
    const { tracks } = useSelector((s: RootState) => s.taglistOnTrack);

    const baseTrack = track;
    if (!track.tags) {
        track = tracks.find(tr => tr.id == track.id) ?? { ...track, tags: [] };
    }

    const playTrack = () => {
        if (currentTrack?.previewUrl != track.previewUrl) {
            dispatch(PlayerActions.setTrack(track));
            dispatch(PlayerActions.setCurrentList(list));
            dispatch(activeManagerActions.setActive(true));
        }
        else {
            dispatch(activeManagerActions.toggleActive());
        }
    };

    const clickToTrack = () => {
        if (focusActive) {
            playTrack();
        }
    };

    const setAnimation = currentTrack?.previewUrl == track.previewUrl && activeManager.active;

    return <Reorder.Item
        value={baseTrack} id={track.id} onClick={clickToTrack}
        className={cn(styles["track"], className, {
            [styles["active-track"]]: currentTrack?.previewUrl == track.previewUrl,
            [styles["focus-track"]]: focusActive
        })}>
        <div className={styles["track-block"]}>
            <div className={styles["start-block"]} onClick={playTrack}>
                {setAnimation && <div className={styles["animation"]}>
                    <div className={styles["stroke"]}></div>
                    <div className={styles["stroke"]}></div>
                    <div className={styles["stroke"]}></div>
                    <div className={styles["stroke"]}></div>
                </div>}
                {!setAnimation && <>
                    <img className={styles["play-icon"]} src="/playIcon.svg" alt="" />
                    <div className={styles["id"]}>{index + 1}</div>
                </>}
            </div>
            <img className={styles["img"]} src={track.img} alt="" />
            <div className={styles["name-author"]}>
                <div className={styles["name"]}>{track.name}</div>
                <div className={styles["author"]}>{track.artists}</div>
            </div>
            <div className={styles["album"]}>
                {track.album}
            </div>
            <Popup
                trigger={<div className={styles["count-tags"]}>{track.tags?.length ?? 0}</div>}
                on={["hover"]}
                position={"top center"}
            >
                <div className={styles["count-tags-popup"]}>Count of tags on this track</div>
            </Popup>
            {track ? <AddTag track={track}></AddTag> : <></>}
            <div className={styles["time"]}>
                {track.durationText}
            </div>
        </div>
        <div className={styles["tags-block"]}>
            <div className={styles["favorites-tags"]}>
                {track.tags.map((tg, index) => {
                    return <TagBlock
                        key={index}
                        tag={tg}
                        className={styles["mini-tag"]}
                        track={track}
                    ></TagBlock>;
                })}
            </div>
            {track ? <AddTag track={track} type="small"></AddTag> : <></>}
        </div>
    </Reorder.Item>;
}

export default TrackItem;