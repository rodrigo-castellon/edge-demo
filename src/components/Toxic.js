/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export function Toxic2(props) {
    let group = useRef();
    let { nodes, materials, animations } = useGLTF(
        "/test_toxic2_out/test_toxic2-transformed.glb"
    );
    let { actions } = useAnimations(animations, group);

    console.log("in here");

    useEffect(() => {
        let keys = Object.keys(actions);
        let k = keys[0];
        // let k = "test_toxic.pkl";
        // k = "mixamo.com";
        console.log(animations);
        console.log(actions);
        // console.log(actions[k]);
        actions[k].reset().play();

        // return () => {
        //     actions[k].fadeOut(10); //reset().stop();
        //     console.log("unmount!!");
        // };

        // setTimeout(() => {
        //     const { nodes, materials, animations } = useGLTF(
        //         "/test_toxic2_out/test_toxic2-transformed.glb"
        //     );
        //     const { actions } = useAnimations(animations, group);

        //     actions[k].play();
        // }, 2000);
    });

    return (
        <group ref={group} {...props} dispose={null}>
            <group name="Root_Scene">
                <group name="RootNode">
                    <group name="Armature002">
                        <primitive object={nodes.mixamorigHips} />
                    </group>
                    <skinnedMesh
                        name="Alpha_Surface"
                        geometry={nodes.Alpha_Surface.geometry}
                        material={materials["Alpha_Body_MAT.007"]}
                        skeleton={nodes.Alpha_Surface.skeleton}
                    />
                    <skinnedMesh
                        name="Alpha_Joints"
                        geometry={nodes.Alpha_Joints.geometry}
                        material={materials["Alpha_Joints_MAT.007"]}
                        skeleton={nodes.Alpha_Joints.skeleton}
                    >
                        <meshPhongMaterial color="#3399ff" shininess={1000} />
                    </skinnedMesh>
                </group>
            </group>
        </group>
    );
}

export function Toxic(props) {
    let group = useRef();
    let { nodes, materials, animations } = useGLTF(
        // props.path
        "toxic_slow_out/toxic_slow-transformed.glb"
        // "/test_toxic2_out/test_toxic2-transformed.glb"
    );
    let { actions } = useAnimations(animations, group);

    console.log("in here");

    useEffect(() => {
        let keys = Object.keys(actions);
        let k = keys[0];
        // let k = "test_toxic.pkl";
        // k = "mixamo.com";
        console.log(animations);
        console.log(actions);
        // console.log(actions[k]);
        actions[k].reset().play();

        // return () => {
        //     actions[k].fadeOut(10); //reset().stop();
        //     console.log("unmount!!");
        // };

        // setTimeout(() => {
        //     const { nodes, materials, animations } = useGLTF(
        //         "/test_toxic2_out/test_toxic2-transformed.glb"
        //     );
        //     const { actions } = useAnimations(animations, group);

        //     actions[k].play();
        // }, 2000);
    });

    return (
        <group ref={group} {...props} dispose={null}>
            <group name="Root_Scene">
                <group name="RootNode">
                    <group name="Armature002">
                        <primitive object={nodes.mixamorigHips} />
                    </group>
                    <skinnedMesh
                        name="Alpha_Surface"
                        geometry={nodes.Alpha_Surface.geometry}
                        material={materials["Alpha_Body_MAT.007"]}
                        skeleton={nodes.Alpha_Surface.skeleton}
                    />
                    <skinnedMesh
                        name="Alpha_Joints"
                        geometry={nodes.Alpha_Joints.geometry}
                        material={materials["Alpha_Joints_MAT.007"]}
                        skeleton={nodes.Alpha_Joints.skeleton}
                    >
                        <meshPhongMaterial color="#3399ff" shininess={1000} />
                    </skinnedMesh>
                </group>
            </group>
        </group>
    );
}

useGLTF.preload("/test_toxic2_out/test_toxic2-transformed.glb");
