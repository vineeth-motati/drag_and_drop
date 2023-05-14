"use client";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import undoIcon from "@iconify/icons-material-symbols/undo";

const Table = () => {
  const [items, setItems] = useState([
    { name: "Item1", bgColor: "bg-teal-300" },
    { name: "Item2", bgColor: "bg-yellow-300" },
    { name: "Item3", bgColor: "bg-pink-300" },
    { name: "Item4", bgColor: "bg-green-300" },
    { name: "Item5", bgColor: "bg-gray-400" },
    { name: "Item6", bgColor: "bg-orange-300" },
    { name: "Item7", bgColor: "bg-purple-400" },
    { name: "Item8", bgColor: "bg-red-400" },
    { name: "Item9", bgColor: "bg-cyan-300" },
  ]);
  const [sourceDestination, setSourceDestination] = useState(["", ""]);
  const [undoSourceDestination, setUndoSourceDestination] = useState(["", ""]);

  const undo = undoSourceDestination.every((value) => value !== "");
  useEffect(() => {
    console.log(sourceDestination);
    if (
      sourceDestination.every((value) => value !== "") &&
      !sourceDestination[1].includes(sourceDestination[0])
    ) {
      setUndoSourceDestination(() => [...sourceDestination]);
    }
  }, [sourceDestination]);

  const handleUndo = () => {
    // setSourceDestination(undoSourceDestination);
    // setSourceDestination((prevState) => {
    //   return [...undoSourceDestination];
    // });
    dragAndDrop(undoSourceDestination);
    setUndoSourceDestination(["", ""]);
  };

  const dragAndDrop = ([sourceItemId, destCellId]) => {
    const itemsCopy = [...items];

    const sourceDivIndex = itemsCopy.findIndex((object) => {
      return object.name === document.getElementById(sourceItemId).id;
    });

    const destDivIndex = itemsCopy.findIndex((object) => {
      return (
        object.name ===
        document.getElementById(destCellId).getElementsByTagName("div")[0].id
      );
    });

    swapObjects(itemsCopy, sourceDivIndex, destDivIndex);
    if (!destCellId.includes(sourceItemId)) {
      // setUndoSourceDestination(sourceDestination);
      console.log(destCellId.includes(sourceItemId));
    }

    // setItems(itemsCopy);

    const sourceElement = document.getElementById(sourceItemId);
    const destElement = document.getElementById(
      document.getElementById(destCellId).getElementsByTagName("div")[0].id
    );

    if (sourceElement && destElement && sourceElement !== destElement) {
      // Get the offset positions of the source and destination elements
      const sourceOffset = sourceElement.getBoundingClientRect();
      const destOffset = destElement.getBoundingClientRect();

      // Calculate the difference between the source and destination offsets
      const offsetDiffSource = {
        x: destOffset.left - sourceOffset.left + 95,
        y: destOffset.top - sourceOffset.top + 95,
      };
      const offsetDiffDest = {
        x: sourceOffset.left - destOffset.left + 95,
        y: sourceOffset.top - destOffset.top + 95,
      };

      // Apply a transition to the source element's "left" and "top" properties
      sourceElement.style.transition = "left 0.8s, top 1s, opacity 0.001s";
      sourceElement.style.left = `${offsetDiffSource.x}px`;
      sourceElement.style.top = `${offsetDiffSource.y}px`;
      sourceElement.style.opacity = "0.7";

      // Apply a transition to the replaced element's "opacity" property
      destElement.style.transition = "left 0.8s, top 1s, opacity 0.001s";
      destElement.style.left = `${offsetDiffDest.x}px`;
      destElement.style.top = `${offsetDiffDest.y}px`;
      destElement.style.opacity = "0.3";

      // After the animation finishes, remove the transitions and reset the positions and opacity
      setTimeout(() => {
        sourceElement.style.transition = "";
        sourceElement.style.left = "";
        sourceElement.style.top = "";
        sourceElement.style.opacity = "";
        destElement.style.transition = "";
        destElement.style.left = "";
        destElement.style.top = "";
        destElement.style.opacity = "";
        setItems(itemsCopy);
      }, 1000);
    }
  };

  const swapObjects = (array, index1, index2) => {
    const temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
  };

  const handleDragStart = (event) => {
    // This method runs when the dragging starts
    event.target.classList.add("opacity-50");
    const tableCells = document.querySelectorAll(".table-cell");

    tableCells.forEach((cell) => {
      cell.addEventListener("dragenter", (e) => {
        if (!cell.id.includes(event.target.id)) {
          setSourceDestination([event.target.id, cell.id]);
          // setUndoSourceDestination(sourceDestination);
        } else {
          setSourceDestination(["", ""]);
        }
        Array.from(document.querySelectorAll(".table-cell.dropZone")).forEach(
          (el) => el.classList.remove("dropZone")
        );
        cell.classList.add("dropZone");
      });
    });
  };

  const handleDrag = (event) => {
    event.preventDefault();
    const section = document.querySelector("section");
    section.addEventListener("dragenter", (e) => {});
  };
  const handleDragEnd = (event) => {
    event.preventDefault();
    if (sourceDestination.every((value) => value !== "")) {
      dragAndDrop(sourceDestination);
    }
    event.target.classList.remove("opacity-50");
  };

  return (
    <>
      <section className="relative">
        <div>
          <a
            type="button"
            className={`absolute -top-12 right-0 
              text-white inline-block rounded-md cursor-pointer
               pointer-events-none z-10
              ${
                undo && "opacity-100 pointer-events-auto bg-zinc-700 py-2 px-4 "
              }`}
            onClick={handleUndo}
          >
            <Icon icon={undoIcon} />
          </a>
        </div>
        <table className="table-auto relative bg-white rounded-lg shadow-xl border-collapse">
          <tbody>
            {[0, 1, 2].map((row) => (
              <tr key={row} className="table-row ">
                {[0, 1, 2].map((col) => (
                  <td
                    key={col}
                    id={`cell-${items[row * 3 + col].name}`}
                    className="table-cell border px-24 relative py-24 w-12 h-12 items-center"
                  >
                    <div
                      id={items[row * 3 + col].name}
                      draggable
                      onDragStart={handleDragStart}
                      onDrag={handleDrag}
                      onDragEnd={handleDragEnd}
                      className={`item absolute border top-[50%] left-[50%] 
                      -translate-x-[50%] -translate-y-[50%] w-24 h-24 shadow-2xl 
                      flex text-xl items-center justify-center 
                      cursor-grab rounded-md ${items[row * 3 + col].bgColor}`}
                    >
                      {items[row * 3 + col].name}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default Table;
