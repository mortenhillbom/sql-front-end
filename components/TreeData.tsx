import { DataNode } from "antd/lib/tree";
import { Tree } from "antd";

const DataTree = ({ dataObject }: { dataObject: any }) => {
  const objectToTreeData = (obj: any): DataNode[] => {
    return Object.keys(obj).map((objKey) => {
      if (typeof obj[objKey] === "object") {
        return {
          title: objKey,
          key: objKey,
          children: objectToTreeData(obj[objKey]),
        };
      }
      return {
        title: String(objKey),
        key: objKey,
        children: [{ title: String(obj[objKey]), key: String(obj[objKey]) }],
      };
    });
  };

  return <Tree treeData={objectToTreeData(dataObject)} />;
};

export default DataTree;
