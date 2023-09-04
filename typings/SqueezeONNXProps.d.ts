/**
 * This file was generated from SqueezeONNX.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { CSSProperties } from "react";
import { DynamicValue, FileValue, WebImage } from "mendix";

export interface SqueezeONNXContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    file: DynamicValue<FileValue>;
    image: DynamicValue<WebImage>;
}

export interface SqueezeONNXPreviewProps {
    className: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    file: string;
    image: { type: "static"; imageUrl: string; } | { type: "dynamic"; entity: string; } | null;
}
