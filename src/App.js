import React from 'react';

// routes
// import Router from './routes';
// theme
// import ThemeProvider from './theme';
// components
// import ScrollToTop from './components/scroll-to-top';
// import { StyledChart } from './components/chart';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { OrbitControls, MeshReflectorMaterial, Stats } from '@react-three/drei'
import { LinearEncoding, RepeatWrapping, TextureLoader } from "three";
import { Hiphop } from './components/Hiphop';

export function Ground() {
    // thanks to https://polyhaven.com/a/rough_plasterbrick_05 !
    const [roughness, normal] = useLoader(TextureLoader, [
      "assets/textures/terrain-roughness.jpeg",
      "assets/textures/terrain-normal.jpeg",
    ]);
  
    useEffect(() => {
      [normal, roughness].forEach((t) => {
        t.wrapS = RepeatWrapping;
        t.wrapT = RepeatWrapping;
        t.repeat.set(5, 5);
        t.offset.set(0, 0);
      });
  
      normal.encoding = LinearEncoding;
    }, [normal, roughness]);
  
    // useFrame((state, delta) => {
    //   let t = -state.clock.getElapsedTime() * 0.128;
    //   roughness.offset.set(0, t % 1);
    //   normal.offset.set(0, t % 1);
    // });
  
    return (
      <mesh rotation-x={-Math.PI * 0.5} castShadow receiveShadow>
        <planeGeometry args={[30, 30]} />
        <MeshReflectorMaterial
          envMapIntensity={0}
          normalMap={normal}
          normalScale={[0.15, 0.15]}
          roughnessMap={roughness}
          dithering={true}
          color={[0.015, 0.015, 0.015]}
          roughness={0.7}
          blur={[1000, 400]} // Blur ground reflections (width, heigt), 0 skips blur
          mixBlur={30} // How much blur mixes with surface roughness (default = 1)
          mixStrength={80} // Strength of the reflections
          mixContrast={1} // Contrast of the reflections
          resolution={1024} // Off-buffer resolution, lower=faster, higher=better quality, slower
          mirror={0} // Mirror environment, 0 = texture colors, 1 = pick up env colors
          depthScale={0.01} // Scale the depth factor (0 = no depth, default = 0)
          minDepthThreshold={0.9} // Lower edge for the depthTexture interpolation (default = 0)
          maxDepthThreshold={1} // Upper edge for the depthTexture interpolation (default = 0)
          depthToBlurRatioBias={0.25} // Adds a bias factor to the depthTexture before calculating the blur amount [blurFactor = blurTexture * (depthTexture + bias)]. It accepts values between 0 and 1, default is 0.25. An amount > 0 of bias makes sure that the blurTexture is not too sharp because of the multiplication with the depthTexture
          debug={0}
          reflectorOffset={0.2} // Offsets the virtual camera that projects the reflection. Useful when the reflective surface is some distance from the object's origin (default = 0)
        />
      </mesh>
    );
  }

function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += delta))
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}


const deg2rad = degrees => degrees * (Math.PI / 180);


// ----------------------------------------------------------------------
function App() {

    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <Container>
                        <Navbar.Brand href="#home">
                        <img
                                alt=""
                                src="https://react-bootstrap.github.io/logo.svg"
                                width="30"
                                height="30"
                                className="d-inline-block align-top"
                        />{' '}
                        EDGE: Editable Dance Generation From Music
                        </Navbar.Brand>
                </Container>
            </Navbar>
            <Suspense fallback={null}>
                <Canvas shadows camera={{ fov: 75, position: [-2, 4, 4], rotation: [30,0,0]}}>
                    <color args={[0, 0, 0]} attach="background" />
                    <spotLight
                        color={[1, 0.25, 0.7]}
                        intensity={1.5}
                        angle={0.6}
                        penumbra={0.5}
                        position={[5, 5, 0]}
                        castShadow
                        shadow-bias={-0.0001}
                    />
                    <spotLight
                        color={[0.14, 0.5, 1]}
                        intensity={2}
                        angle={0.6}
                        penumbra={0.5}
                        position={[-5, 5, 0]}
                        castShadow
                        shadow-bias={-0.0001}
                    />
                    <ambientLight intensity={0.5} />
                    {/* <Box position={[-1.2, 0, 0]} />
                    <Box position={[1.2, 0, 0]} /> */}
                    <Ground />
                    <OrbitControls 
                        target={[0, 0.35, 0]}
                        maxPolarAngle={1.45}
                    />
                    <Hiphop />
                    <Stats />
                </Canvas>
            </Suspense>
        </div>
    );
  }


export default App;