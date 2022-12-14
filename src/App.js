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
import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

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
          <Canvas>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
            <Box position={[-1.2, 0, 0]} />
            <Box position={[1.2, 0, 0]} />
            <OrbitControls />
          </Canvas>
      </div>
    );
  }


export default App;