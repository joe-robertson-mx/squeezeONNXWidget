import { ReactElement, createElement, useState, useEffect, useRef } from "react";
import { runSqueezenetModel } from "../utils/modelHelper";
import * as mathUtils from "../utils/math";
import * as imagenetUtils from "../utils/imagenet";
import { imageDataToTensor } from "../utils/imageHelperWasm";

export interface ONNXModelExecutionProps {
    fileURI: string;
    imageURI: string;
}

interface results {
    name: string;
    probability: number;
}

export function ONNXModelExecution({ fileURI, imageURI }: ONNXModelExecutionProps): ReactElement {
    const [inferenceTime, setInferenceTime] = useState("");
    const [initialLoad, setInitialLoad] = useState(true);
    const [results, setResults] = useState<results[]>();

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const height = 224;
    const width = 224;
    useEffect(() => {
        // Initialize
        const imgElement = imgRef.current!;
        canvasCtxRef.current = canvasRef.current!.getContext("2d");
        const ctx = canvasCtxRef.current!;
        imgElement.onload = () => {
            imgElement.height = height;
            imgElement.width = width;
            redraw(ctx, imgElement);
        };
    }, [initialLoad]);

    const redraw = (ctx: CanvasRenderingContext2D, imgElement: HTMLImageElement): void => {
        ctx.canvas.width = imgElement.width;
        ctx.canvas.height = imgElement.height;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(imgElement, 0, 0, ctx.canvas.width, ctx.canvas.height);
        if (initialLoad) {
            setInitialLoad(false);
        }
    };

    console.log(fileURI, imageURI);
    const runInference = async () => {
        // Clear out previous values.
        setInferenceTime("");
        canvasCtxRef.current = canvasRef.current!.getContext("2d");
        const ctx = canvasCtxRef.current!;
        const data = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        const imageTensor = imageDataToTensor(data);
        console.dir(imageTensor);
        const [predictions, inferenceTime] = await runSqueezenetModel(imageTensor, fileURI);

        console.dir(predictions);
        const output = getPredictedClass(predictions.data);
        console.dir(output);
        const resToBeSet = output.map(o => {
            return { name: o.name, probability: o.probability } as results;
        });
        setResults(resToBeSet);
        // const topResult = predictions[0];
        // setLabel(topResult.name.toUpperCase());
        // setConfidence(topResult.probability);
        setInferenceTime(`Inference speed: ${inferenceTime} seconds`);
    };

    const getPredictedClass = (res: Float32Array) => {
        if (!res || res.length === 0) {
            const empty = [];
            for (let i = 0; i < 5; i++) {
                empty.push({ name: "-", probability: 0, index: 0 });
            }
            return empty;
        }
        const output = mathUtils.softmax(Array.prototype.slice.call(res));
        return imagenetUtils.imagenetClassesTopK(output, 5);
    };

    return (
        <div>
            <div>
                <img ref={imgRef} src={imageURI} style={{ visibility: "hidden", position: "absolute" }} />
                <canvas ref={canvasRef} />
            </div>
            <div>
                <button className="mx-button" onClick={runInference}>
                    Run Inference
                </button>
                <ul>
                    {results &&
                        results.map(r => {
                            return (
                                <li key={r.name}>
                                    <h3>{r.name}</h3>
                                    <h4>{r.probability}%</h4>
                                </li>
                            );
                        })}
                </ul>
                <span>{inferenceTime}</span>
            </div>
        </div>
    );
}
