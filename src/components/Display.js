import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { extend } from "@react-three/fiber";
import { Ground } from "./Ground";
import { createYBotComponent } from "./YBot";

export default function Display(props) {
    let YBot = null;

    YBot = createYBotComponent(
        props.path,
        props.playElement,
        props.startTimestamp
    );
    extend({ YBot });

    return (
        <Suspense fallback={null}>
            <Canvas
                shadows
                camera={{
                    fov: 75,
                    position: [0, 2, 3],
                    rotation: [30, 0, 0],
                }}
            >
                <color args={[0, 0, 0]} attach="background" />
                <Suspense fallback={null}>
                    <spotLight
                        color={[1, 0.25, 0.7]}
                        intensity={1.5}
                        angle={0.6}
                        penumbra={0.5}
                        position={[5, 5, 0]}
                        castShadow
                        shadow-bias={-0.0001}
                    />
                </Suspense>
                <Suspense fallback={null}>
                    <spotLight
                        color={[0.14, 0.5, 1]}
                        intensity={2}
                        angle={0.6}
                        penumbra={0.5}
                        position={[-5, 5, 0]}
                        castShadow
                        shadow-bias={-0.0001}
                    />
                </Suspense>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                </Suspense>
                <Suspense fallback={null}>
                    <Ground />
                </Suspense>
                <OrbitControls target={[0, 0.35, 0]} maxPolarAngle={1.45} />
                <Suspense fallback={null}>
                    <YBot path={props.path} />
                </Suspense>
            </Canvas>
        </Suspense>
    );
}
