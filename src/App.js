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
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { Ground } from './components/Ground';
import { Hiphop } from './components/Hiphop';


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