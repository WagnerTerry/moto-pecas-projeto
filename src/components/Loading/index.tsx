import React from "react";
import ReactLoading from "react-loading";

const Loading = ({ color, height, width, size }: any) => {
    return (
        <ReactLoading
            type={"spin"}
            color={color || "#FFF"}
            height={height || size || 50}
            width={width || size || 50}
        />
    );
};

export default React.memo(Loading);
