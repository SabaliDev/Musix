import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { removeFromQueue, reorderQueue, setActiveSong } from '../redux/features/playerSlice';
import { FaPlay, FaTrash } from 'react-icons/fa';

const QueueItem = ({ song, index, moveItem }) => {
  const dispatch = useDispatch();
  const ref = React.useRef(null);

  const [, drag] = useDrag({
    type: 'QUEUE_ITEM',
    item: { index },
  });

  const [, drop] = useDrop({
    accept: 'QUEUE_ITEM',
    hover(item, monitor) {
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
  const handlePlay = () => dispatch(setActiveSong({ song, data: [song], i: 0 }));

  return (
    <div ref={ref} className="flex items-center justify-between bg-gray-800 p-4 mb-2 rounded cursor-move">
      <div className="flex items-center">
        <img src={song.img} alt={song.title} className="w-12 h-12 rounded mr-4" />
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

const QueuePage = () => {
  const dispatch = useDispatch();
  const { queue } = useSelector((state) => state.player);

  const moveItem = (oldIndex, newIndex) => {
    dispatch(reorderQueue({ oldIndex, newIndex }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-8 bg-gray-900 min-h-screen">
        <h2 className="text-3xl font-bold text-white mb-6">Queue</h2>
        {queue.map((song, index) => (
          <QueueItem key={`${song.songId}-${index}`} song={song} index={index} moveItem={moveItem} />
        ))}
      </div>
    </DndProvider>
  );
};

export default QueuePage;