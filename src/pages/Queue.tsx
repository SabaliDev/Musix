import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  removeFromQueue,
  reorderQueue,
  setActiveSong,
} from "../redux/features/playerSlice";
import { FaPlay, FaTrash } from "react-icons/fa";
import { RootState, AppDispatch } from "../redux/store";
import { Song } from "../types";

interface QueueItemProps {
  song: Song;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const ItemTypes = {
  QUEUE_ITEM: "queue_item",
};

const QueueItem: React.FC<QueueItemProps> = ({ song, index, moveItem }) => {
  const dispatch = useDispatch<AppDispatch>();
  const ref = React.useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag<
    DragItem,
    unknown,
    { isDragging: boolean }
  >({
    type: ItemTypes.QUEUE_ITEM,
    item: { index, id: song.songId.toString(), type: ItemTypes.QUEUE_ITEM },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop<DragItem, unknown, unknown>({
    accept: ItemTypes.QUEUE_ITEM,
    hover(item: DragItem) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  const handleRemove = () => dispatch(removeFromQueue(index));
  const handlePlay = () =>
    dispatch(setActiveSong({ song, data: [song], i: 0 }));

  return (
    <div
      ref={ref}
      className={`flex items-center justify-between bg-gray-800 p-4 mb-2 rounded cursor-move ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center">
        <img
          src={song.img}
          alt={song.title}
          className="w-12 h-12 rounded mr-4"
        />
        <div>
          <h3 className="text-white font-semibold">{song.title}</h3>
          <p className="text-gray-400">{song.artist}</p>
        </div>
      </div>
      <div className="flex items-center">
        <FaPlay
          onClick={handlePlay}
          className="text-white text-xl cursor-pointer transition-colors mr-4"
          title="Play"
        />
        <FaTrash
          onClick={handleRemove}
          className="text-red-500 text-xl cursor-pointer hover:text-red-400 transition-colors"
          title="Remove from Queue"
        />
      </div>
    </div>
  );
};

const QueuePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { queue } = useSelector((state: RootState) => state.player);

  const moveItem = (oldIndex: number, newIndex: number) => {
    dispatch(reorderQueue({ oldIndex, newIndex }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-8 bg-gray-900 min-h-screen">
        <h2 className="text-3xl font-bold text-white mb-6">Queue</h2>
        {queue.map((song, index) => (
          <QueueItem
            key={`${song.songId}-${index}`}
            song={song}
            index={index}
            moveItem={moveItem}
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default QueuePage;
