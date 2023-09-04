import { ReactElement, createElement } from "react";
import { ValueStatus } from "mendix";
import { ONNXModelExecution } from "./components/ONNXModelExecution";
import { SqueezeONNXContainerProps } from "../typings/SqueezeONNXProps";

import "./ui/SqueezeONNX.css";

export default function SqueezeONNX({ image, file }: SqueezeONNXContainerProps): ReactElement {
    return (
        <div>
            {image.status === ValueStatus.Available &&
                image.value &&
                file.status === ValueStatus.Available &&
                file.value && <ONNXModelExecution fileURI={file.value.uri} imageURI={image.value.uri} />}
        </div>
    );
}
