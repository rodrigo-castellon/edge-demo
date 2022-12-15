/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Mesh } from "three";

export function Hiphop(props) {
    const group = useRef()
    const { nodes, materials, animations } = useGLTF('/hiphop.glb')
    // const { actions } = useAnimations(animations, group)

    const gltf = useLoader(GLTFLoader, "/hiphop.gltf");
    // const { actions } = useAnimations(gltf.animations, group);
    const { actions } = useAnimations(animations, group);

    useEffect(() => {
        actions['Armature|mixamo.com|Layer0'].play()
    });

    // return <primitive object={gltf.scene} />;
    return (
        <group ref={group} {...props} dispose={null}>
            <group name="Scene">
                <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
                    <primitive object={nodes.mixamorigHips} />
                    <skinnedMesh
                        name="Alpha_Joints"
                        geometry={nodes.Alpha_Joints.geometry}
                        material={materials.Alpha_Joints_MAT}
                        skeleton={nodes.Alpha_Joints.skeleton}
                        receiveShadow
                        castShadow />
                    <skinnedMesh
                    name="Alpha_Surface"
                    geometry={nodes.Alpha_Surface.geometry}
                    material={materials.Alpha_Body_MAT}
                    skeleton={nodes.Alpha_Surface.skeleton}
                    receiveShadow
                    castShadow>
                        <meshPhongMaterial
                            color="#3399ff"
                            shininess={1000} />
                    </skinnedMesh>
                </group>
            </group>
        </group>
    )
}

useGLTF.preload('/hiphop.glb')
