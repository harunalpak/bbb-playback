import React from 'react';
import Chat from 'components/chat';
import Notes from 'components/notes';
import { ID } from 'utils/constants';

const Content = ({
  chat,
  current,
  currentChatIndex,
  notes,
  player,
}) => {
  switch (current) {
    case ID.CHAT:

      return (
        <Chat
          chat={chat}
          currentDataIndex={currentChatIndex}
          player={player}
        />
      );
    case ID.NOTES:

      return (
        <Notes notes={notes} />
      );
    default:

      return null;
  }
};

const areEqual = (prevProps, nextProps) => {
  if (prevProps.current !== nextProps.current) return false;

  if (prevProps.currentChatIndex !== nextProps.currentChatIndex) return false;

  if (!prevProps.player && nextProps.player) return false;

  return true;
};

export default React.memo(Content, areEqual);
