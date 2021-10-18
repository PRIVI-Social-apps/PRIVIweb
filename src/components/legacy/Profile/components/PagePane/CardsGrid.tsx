import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import UseWindowDimensions from "shared/hooks/useWindowDimensions";
import ProfileCardETH from "../Profile-card/ProfileCardETH";
import ProfileCard from "../Profile-card/ProfileCard";
import { useSelector } from "react-redux";
import { getSelectedUser, getUser } from "store/selectors";
import MediaCard from "components/legacy/Media/components/Cards/MediaCard/MediaCard";
import PodCard from "components/legacy/Pods/Pod-Card/PodCard";
import ProfilePlaylistCard from "../Profile-card/ProfilePlaylistCard";

const CardsGrid = React.memo(
  (props: any) => {
    const { list, type, userProfile, getAllInfoProfile, ownUser, hasMore } = props;
    const [columns, setColumns] = React.useState({
      firstColumn: [] as any[],
      secondColumn: [] as any[],
      thirdColumn: [] as any[],
      fourthColumn: [] as any[],
    });

    const userSelector = useSelector(getUser);
    const selectedUserSelector = useSelector(getSelectedUser);
    const { width } = UseWindowDimensions();

    const isSignedIn = () => {
      return !!sessionStorage.getItem("token");
    };

    React.useEffect(() => {
      const firstColumn = [] as any[];
      const secondColumn = [] as any[];
      const thirdColumn = [] as any[];
      const fourthColumn = [] as any[];

      for (let i = 0; i < list.length; i++) {
        let uniqueId = `${type}_${i}`;
        if (list[i]._priviUniqueId !== undefined) {
          uniqueId = list[i]._priviUniqueId;
        }
        const columnCount = width >= 1400 ? 4 : 3;
        if (i % columnCount === 0) {
          firstColumn.push({ ...list[i], _uniqueId: uniqueId });
        } else if (i % columnCount === 1) {
          secondColumn.push({ ...list[i], _uniqueId: uniqueId });
        } else if (i % columnCount === 2) {
          thirdColumn.push({ ...list[i], _uniqueId: uniqueId });
        } else {
          fourthColumn.push({ ...list[i], _uniqueId: uniqueId });
        }
      }

      setColumns({
        firstColumn: [...firstColumn],
        secondColumn: [...secondColumn],
        thirdColumn: [...thirdColumn],
        fourthColumn: [...fourthColumn],
      });
    }, [props, width]);

    const moveCard = (source, destination, droppableSource, droppableDestination) => {
      const sourceClone = Array.from(source);
      const destClone = Array.from(destination);
      const [removed] = sourceClone.splice(droppableSource.index, 1);

      destClone.splice(droppableDestination.index, 0, removed);

      const result = {};
      result[droppableSource.droppableId] = sourceClone;
      result[droppableDestination.droppableId] = destClone;

      return result;
    };

    const onDragEnd = result => {
      const { destination, source } = result;

      if (!destination) {
        return;
      }

      if (destination.droppableId === source.droppableId && destination.index === source.index) {
        return;
      }

      if (source.droppableId === destination.droppableId) {
        const column = [...columns[source.droppableId]];
        const newCards = Array.from(column);
        const newCard = column[source.index];
        newCards.splice(source.index, 1);
        newCards.splice(destination.index, 0, newCard);

        const newColumns = {
          ...columns,
          [source.droppableId]: [...newCards],
        };

        setColumns(newColumns);
        localStorage.setItem(
          "communitiesAndTokensFirstColumn",
          JSON.stringify(
            columns["firstColumn"].map(
              (item: any, index) => item._uniqueId ?? item._priviUniqueId ?? `${index}_${type}`
            )
          )
        );
      } else {
        const result = moveCard(
          columns[source.droppableId],
          columns[destination.droppableId],
          source,
          destination
        );
        const newColumns = { ...columns };
        newColumns[source.droppableId] = result[source.droppableId];
        newColumns[destination.droppableId] = result[destination.droppableId];

        setColumns(newColumns);
      }
    };

    if (list && list.length > 0) {
      return (
        <div className="cards-grid">
          <DragDropContext onDragEnd={onDragEnd}>
            {["firstColumn", "secondColumn", "thirdColumn", "fourthColumn"].map((columnId, columnIndex) => {
              if (columnId === "fourthColumn" && width < 1400) return null;
              return (
                <Droppable droppableId={columnId} key={columnIndex}>
                  {provided => (
                    <div className="column" ref={provided.innerRef} {...provided.droppableProps}>
                      {columns[columnId].map((item, index) => (
                        <React.Fragment
                          key={item._uniqueId ?? item._priviUniqueId + `_${type}` + `_${index}`}
                        >
                          <Draggable
                            isDragDisabled={!isSignedIn() || !ownUser}
                            key={item._uniqueId ?? item._priviUniqueId ?? `${index}_${type}`}
                            draggableId={item._uniqueId ?? item._priviUniqueId ?? `${index}_${type}`}
                            index={index}
                          >
                            {providedDraggable => (
                              <div
                                {...providedDraggable.draggableProps}
                                {...providedDraggable.dragHandleProps}
                                ref={providedDraggable.innerRef}
                              >
                                {type === "Media" ? (
                                  <MediaCard
                                    media={item}
                                    dimensions={item.dimensions}
                                    key={item.id ?? item.MediaSymbol ?? `media${index}`}
                                    showDetailsModal
                                  />
                                ) : type === "MediaPods" ? (
                                  <div className="pod-wrapper">
                                    <PodCard
                                      pod={item}
                                      type={"Physical-NFT"}
                                      key={`${item.PodAddress}${"Physical-NFT"}`}
                                      disableClick={() => { }}
                                    />
                                  </div>
                                ) : type === "Playlist" ? (
                                  <ProfilePlaylistCard
                                    key={item.id ?? `playlist${index}`}
                                    playlist={item}
                                    refreshAllProfile={userId => {
                                      getAllInfoProfile(userId);
                                    }}
                                  />
                                ) : !item.IsEthWallet ? (
                                  <ProfileCard
                                    item={item}
                                    type={
                                      type === "Social"
                                        ? !item.Members
                                          ? "Social Token"
                                          : "Community"
                                        : type === "Pods"
                                          ? item.AMM
                                            ? "FT"
                                            : "NFT"
                                          : type
                                    }
                                    userProfile={userProfile}
                                    refreshAllProfile={userId => {
                                      getAllInfoProfile(userId);
                                    }}
                                    key={`${type}-card-${index}`}
                                  />
                                ) : (
                                  <ProfileCardETH
                                    item={item}
                                    type={
                                      type === "Social"
                                        ? !item.Members
                                          ? "Social Token"
                                          : "Community"
                                        : type === "Pods"
                                          ? item.AMM
                                            ? "FT"
                                            : "NFT"
                                          : type
                                    }
                                    userProfile={userProfile}
                                    refreshAllProfile={() => {
                                      getAllInfoProfile(selectedUserSelector.id);
                                    }}
                                    key={`${type}-card-${index}`}
                                  />
                                )}
                              </div>
                            )}
                          </Draggable>
                        </React.Fragment>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              );
            })}
          </DragDropContext>
        </div>
      );
    } else {
      if (hasMore) return null;
      return <div className="noItemsCardsGrid">No items to show</div>;
    }
  },
  (prevProps, nextProps) =>
    prevProps.list === nextProps.list &&
    prevProps.type === nextProps.type &&
    prevProps.userProfile === nextProps.userProfile &&
    prevProps.hasMore === nextProps.hasMore
);

export default CardsGrid;
