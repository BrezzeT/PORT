import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";

function ParticleField() {
    const ref = useRef();

    // Генерация позиций звезд вручную без лишних библиотек
    const positions = useMemo(() => {
        const pos = new Float32Array(5000 * 3);
        for (let i = 0; i < 5000; i++) {
            // Создаем точки внутри сферы
            const r = 1.5;
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;
        }
        return pos;
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 30; // Замедлил в 2 раза
            ref.current.rotation.y -= delta / 40; // Замедлил в 2 раза
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#ffffff" // Сделал белым (было бирюзовое)
                    size={0.005} // Увеличил размер (было 0.003)
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.8} // Сделал ярче (было 0.6)
                />
            </Points>
        </group>
    );
}

export default function Background3D() {
    return (
        <div className="canvas-container">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <ParticleField />
            </Canvas>
        </div>
    );
}
