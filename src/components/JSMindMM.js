import React, { useEffect, useRef, useState } from "react";
import "../App.css";

const JSMindMM = ({ mind, styles, options, onClickCourse }) => {
  const jmContainer = useRef(null);
  const [jmInstance, setJmInstance] = useState(null);
  const [nodeClicked, setNodeClicked] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [clickedNode, setClickedNode] = useState(false);
  const [popupOpened, setPopupOpened] = useState(false);
  const [popupClosed, setPopupClosed] = useState(false);
  const [addNode, setAddNode] = useState(false);

  const handlePopupClose = (e) => {
    setPopupClosed(true);
    setClickedNode(false);
    
  };

  useEffect(() => {
    const jm = new window.jsMind(options);
    jm.show(mind);
    setJmInstance(jm);

    const nodes = jm.view?.container.querySelectorAll("jmnode");

    const handleHover = (e) => {
      setHoveredNode(null);
      setNodeClicked(false);
      const targetNode = e.currentTarget;
      const nodeId = targetNode.getAttribute("nodeid");
      const node = jm.get_node(nodeId);
      targetNode.style.backgroundColor = node.data?.data?.backgroundColor;
      targetNode.style.transition = "transform 0.5s ease-in-out";
      targetNode.style.transform = "scale(3)";
      targetNode.style.zIndex = "1";
      console.log(targetNode.style.transform)

      if (!nodeClicked) {
        node.data?.data?.info ? setHoveredNode(node) : setHoveredNode(null);
      } else {
        setHoveredNode(null);
      }
    };

    const handleUnHover = (e) => {
      // handleUnHover2(e);
      const targetNode = e.currentTarget;
      // const nodeId = targetNode.getAttribute("nodeid");
      // const node = jm.get_node(nodeId);
      const nodeId = targetNode.getAttribute("nodeid");
      const node = jm.get_node(nodeId);
      targetNode.style.backgroundColor = node.data?.data?.backgroundColor;
      // console.log(popupClosed);
      targetNode.style.transition = "transform 0.5s ease-in-out";
      targetNode.style.transform = "scale(1)";
      
      // targetNode.style.transform = "scale(2.5)";
      targetNode.style.zIndex = "1";
    };

    const handleClick = (e) => {
      const selectedNode = jm.get_selected_node();
      
      setPopupOpened(true);
      setNodeClicked(true);
      console.log(popupOpened);

      if (selectedNode) {
        setClickedNode(true);
        setClickedNode(jm.get_selected_node());
        setHoveredNode(null);
      }
    };


    // jmContainer.current.addEventListener("click", handleClick);
    nodes.forEach((node) => {
      node.addEventListener("mouseenter", handleHover);
      node.addEventListener("mouseleave", handleUnHover);
      node.addEventListener("click", handleClick)
      if(nodeClicked) {
        node.addEventListener("mouseenter", handleHover);
        node.addEventListener("mouseleave", handleHover);
        // setPopupOpened(true)
      }
      // if(handlePopupClose()) {
      //   handleUnHover();
      // }
      const styleNode = jm.get_node(node.getAttribute("nodeid"));
      node.style.backgroundColor = styleNode.data?.data?.backgroundColor;
    });
  }, []);

  return (
    <div>
      <div ref={jmContainer} id={options.container} style={styles}></div>
      <div>
        {clickedNode && nodeClicked && popupOpened && (
          <div
            style={{
              position: "absolute",
              top:
                clickedNode._data?.view?.abs_y +
                clickedNode._data?.view?.height +
                408,
              left: clickedNode._data?.view?.abs_x,
              width: "590px",
              height: "355px",
              backgroundColor: "white",
              // padding: "4px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              zIndex: "1000",
              // display: {},
              boxShadow:
                "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
              padding: "10px",
              transition: "transform 0.5s ease-in-out",
              transform: "scale(3)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
                fontSize: "16px",
                fontWeight: "bold",
                padding: "10px",
              }}
            >
              {clickedNode.topic}
              <div
                style={{
                  position: "absolute",
                  right: "6%",
                  top: "4.8%",
                  display: "flex",
                  justifyContent: "space-between",
                  // gap: "4px",
                  // top: clickedNode._data?.view?.abs_y-clickedNode._data?.view?.height-10,
                  // left: clickedNode._data?.view?.abs_x + (clickedNode._data?.view?.width)/2 - 62,
                  // width: 'auto',
                  backgroundColor: "white",
                  // padding: "4px",
                  // border: "1px solid #ccc",
                  // borderRadius: "4px",
                  zIndex: 2,
                  transition: "transform 0.5s ease-in-out",
                  transform: "scale(1)",
                  // boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
                }}
              >
                <div className="add">
                  <img
                    width="24"
                    height="24"
                    src="https://img.icons8.com/color/48/add--v1.png"
                    alt="add--v1"
                    onClick={(e) => {
                      setAddNode(true);
                      handlePopupClose();
                      var new_node_id =
                        clickedNode.id + "_" + new Date().getTime();
                      var new_node_topic = "This is a new node";
                      jmInstance.add_node(
                        clickedNode.id,
                        new_node_id,
                        new_node_topic
                      );
                      jmInstance.begin_edit(jmInstance.get_node(new_node_id));
                      const nodes =
                        jmInstance.view?.container.querySelectorAll("jmnode");
                      nodes.forEach((node) => {
                        if (node.getAttribute("nodeid") === new_node_id) {
                          const parentNode = jmInstance.get_node(
                            clickedNode.id
                          );
                          node.style.backgroundColor =
                            parentNode.children[0].data?.data?.backgroundColor;
                        }
                      });
                    }}
                  />
                  <span className="addNode">Add Node</span>
                </div>

                {clickedNode.id !== "root" && (
                  <div className="delete">
                    <img
                      width="24"
                      height="24"
                      src="https://img.icons8.com/color/48/delete-forever.png"
                      alt="delete-forever"
                      onClick={() => {
                        jmInstance.remove_node(clickedNode.id);
                        setNodeClicked(false);
                        setHoveredNode(null);
                      }}
                    />
                    <span className="deleteNode">Delete Node</span>
                  </div>
                )}

                {clickedNode.data?.data?.url && (
                  <div className="play">
                    <img
                      width="24"
                      height="24"
                      src="https://img.icons8.com/fluency/48/play.png"
                      alt="play"
                      onClick={() => {
                        onClickCourse(jmInstance.get_selected_node());
                      }}
                    />
                    <span className="playNode">Open Course</span>
                  </div>
                )}

                <div className="mark">
                  <img
                    width="24"
                    height="24"
                    src="https://img.icons8.com/color/48/checked--v1.png"
                    alt="checked--v1"
                    onClick={() => {
                      var existing_data = clickedNode.data?.data;
                      existing_data.backgroundColor = "green";
                      jmInstance.update_node(
                        clickedNode.id,
                        clickedNode.topic,
                        existing_data
                      );
                      const nodes =
                        jmInstance.view?.container.querySelectorAll("jmnode");
                      nodes.forEach((node) => {
                        if (node.getAttribute("nodeid") === clickedNode.id) {
                          node.style.backgroundColor = "green";
                        }
                      });
                    }}
                  />
                  <span className="markNode">Mark as Completed</span>
                </div>

                <span
                  style={{
                    position: "absolute",
                    bottom: "-5px",
                    left: "50px",
                    borderWidth: "10px 10px 0",
                    borderStyle: "solid",
                    borderColor: "#f9f9f9 transparent",
                    display: "block",
                    width: "0",
                  }}
                ></span>
              </div>
              <div className="close">
                <img
                  width="12"
                  height="12"
                  src="https://img.icons8.com/small/16/delete-sign.png"
                  alt="delete-sign"
                  onClick={(e) => handlePopupClose(e)}
                />
                <span className="closeText">Close</span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "end",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  alignItems: "center",
                }}
              >
                <div style={{ padding: "9px", textAlign: "left" }}>
                  {clickedNode.data?.data?.info}
                </div>

                <iframe
                  width="530px"
                  height="162px"
                  title="video"
                  overflow="hidden"
                  src="https://cdn2.percipio.com/secure/b/1696322898.a309974332da98e854e20c850de49950f80c96f6/eot/af58d56f-fc23-4585-98fd-c663cd172d1a/720_2200kps.mp4"
                  allowFullScreen
                ></iframe>
              </div>
              <div>
                <div className="newTab">
                  <a
                    href="https://cdn2.percipio.com/secure/b/1696234779.2bce70d738325a90edb5a3b518f76907c113e7a0/eot/af58d56f-fc23-4585-98fd-c663cd172d1a/720_2200kps.mp4"
                    target="_blank"
                  >
                    <img
                      width="20"
                      height="20"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAP1BMVEX///9AQECtra0zMzMsLCzg4OApKSnX19c6Ojpzc3Ojo6MmJiapqanW1tba2trm5ubFxcW+vr5sbGycnJwXFxd1fVGJAAADRElEQVR4nO3d0XqaQBBAYQsoiaCmJu//rP3QWgTcuDs7rDPpOdcN5c8EVpc2bjZEREREREREREREREREREREtmr7StTvx4c77WWHm9a3isK+qyU158DxPr9Ex5vW9YrCqv4l6e09dMD9TnTASXVlWahBNC5UIFoX5hPNC7OJ9oWbfffThZlT9CDMm6ILYdYUfQhziE6EGUQvQjnRjVBM9COUEh0JhYuGJ6FsimsL6+Z5Xegd8JIomOLKwvpjG9Ep+m8QTHFlYbNVPPxQOtGbMJ3oTphM9CdMJToUJhI9CtMWDZfCTZ/w0sKn8PjThW3KhehR2DYJQI/CpAl6FCYC/QnTfkQdCtvk90/OhMkT9CZMn6AzoWCCvoSSCboSHiQT9CRMXQfdCQ9Gd/XVhKKbjCeh7CbjSCifoBNhxATr4HtiD8KICe62fei74EAYMcHmGN6Bsy+MWOgHYJBoXhix0F+BIaJ1YcRCfwMGiMaFMTeZ4/jHHxFtCyNvMmMPiKaFERPsjtMvWW74WxYmT3BoMUXDwsRr8NZ8inaFogkOzaZoVhi90C+bEq0KExb6ZROiUWHSQr/snmhTKLzJjN0RTQrFN5mxkWhRKFjol/1bNAwKFSY4dJuiPWH2NXjr7xTNCZUmOHSdojVhxkK/7EI0JsxcB+cNRGPC4I6ZCHghGhNuqifEuJvM2H5nTfiEmDbBof2XNeG3xOcL/bLPffrXhE9OZcUPE9MnOBT/r8gjzk3nVVuImHoNrpDWK+/HRNkEdVN79/SIaAGo+A54STQB1NzFmBNtAFV3oqZEAzeZS6q7ifdEIxPU3hEeiZKFfp2Ud/VvRDMT1H8ycyVauQaH1J+uDURDE1zjCWnVmQKu8ZS7P6icmVbF/s/My0LoP4T+Q+g/hP4zIDyd32edA79ZU5QB4bZ7m9WY2/POa7t4OmfuuUVmCDNDWCCEmSEsEMLMEBYIYWYIC4QwM4QFQpgZwgIhzAxhgRBmhrBACDNDWCCEmSEsEMLMEBaouDDu8y0U+1iegoHPKNHswRkY+JyZdUOIEOHrQ4gQ4etDiBDh60OI8D8T9l1tr65XFLZ9Za++VRQSERERERERERERERERERERafQHoYNGT9Oh+koAAAAASUVORK5CYII="
                      alt="open-in-new-tab"
                    />
                  </a>
                  <span className="newtabText">Open in a new Tab</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        {/* {nodeClicked && clickedNode && (
        
      )} */}
      </div>
    </div>
  );
};

export default JSMindMM;
