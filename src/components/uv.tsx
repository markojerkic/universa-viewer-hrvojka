import type { RefObject } from "react";
import {
    useLayoutEffect,
    useState,
    useEffect,
    useRef,
    useMemo,
} from "react";
import { IIIFEvents as BaseEvents, Events } from "universalviewer";
import { init, type Viewer } from "universalviewer";
import "universalviewer/dist/esm/index.css";
import { memo } from "react";

export function useEvent<T extends (param: unknown) => unknown>(
    viewer: Viewer | undefined,
    name: string,
    cb: (...args: { cb: T }[]) => void,
) {
    useLayoutEffect(() => {
        if (viewer) {
            return viewer.on(name, cb);
        }
    }, [viewer, name, cb]);
}

export function useUniversalViewer(
    ref: RefObject<HTMLDivElement>,
    options: unknown,
) {
    const [uv, setUv] = useState<Viewer>();

    useEffect(() => {
        if (ref.current) {
            const currentUv = init(ref.current, options);
            setUv(currentUv);

            return () => {
                currentUv.dispose();
            };
        }
    }, [ref.current, options]);

    return uv;
}

export type UniversalViewerProps = {
    config?: unknown;
    manifestId: string;
    canvasIndex?: number;
    onChangeCanvas?: (manifest: string, canvas: string) => void;
    onChangeManifest?: (manifest: string) => void;
};

export const UniversalViewer = memo(
    ({ manifestId, canvasIndex, onChangeCanvas }: UniversalViewerProps) => {
        const ref = useRef<HTMLDivElement>(null);
        const lastIndex = useRef<number>();
        const options = useMemo(
            () => ({
                manifest: manifestId,
                canvasIndex: canvasIndex || 0,
                embedded: true,
            }),
            [manifestId, canvasIndex],
        );
        const uv = useUniversalViewer(ref, options);

        useEffect(() => {
            if (uv && (canvasIndex || canvasIndex === 0)) {
                if (lastIndex.current !== canvasIndex) {
                    // @ts-ignore
                    uv._assignedContentHandler?.publish(
                        BaseEvents.CANVAS_INDEX_CHANGE,
                        canvasIndex,
                    );
                    lastIndex.current = canvasIndex;
                }
            }
        }, [canvasIndex, uv]);

        useEvent(uv, "configure", ({ cb }) => {
            cb(
                import("./hr-config").then(
                    (confModule) => confModule.config,
                ),
            );
        });


        useEvent(uv, BaseEvents.CANVAS_INDEX_CHANGE, (i) => {
            if (onChangeCanvas) {
                // @ts-ignore
                if (lastIndex.current !== i) {
                    // @ts-ignore
                    const canvas = uv?.extension?.helper.getCanvasByIndex(i);
                    if (canvas) {
                        // @ts-ignore
                        lastIndex.current = i;
                        // onChangeCanvas(manifestId, canvas.id);
                    }
                }
            }
        });

        useEvent(uv, Events.ERROR, (i) => {
            console.error("UV error", i);
        });

        return (
            <>
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/universalviewer@4.0.17/dist/esm/index.css"
                />
                <div
                    className="uv h-96 overflow-hidden rounded-md md:h-[35rem]"
                    ref={ref}
                />
            </>
        );
    },
);
