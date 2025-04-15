"use client"

import { useRef, useEffect } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import type { ARModel } from "@/lib/services/ar-service"

interface ARFallbackProps {
  model: ARModel
}

export default function ARFallback({ model }: ARFallbackProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Initialiser Three.js
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf5f5f5)

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)

    containerRef.current.innerHTML = ""
    containerRef.current.appendChild(renderer.domElement)

    // Ajouter les contrôles
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05

    // Ajouter l'éclairage
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(0, 10, 5)
    scene.add(directionalLight)

    // Charger le modèle 3D
    const loader = new GLTFLoader()
    loader.load(
      model.modelUrl,
      (gltf) => {
        const object = gltf.scene

        // Appliquer l'échelle et la position
        object.scale.set(model.scale, model.scale, model.scale)
        object.position.set(0, 0, 0)

        // Centrer le modèle
        const box = new THREE.Box3().setFromObject(object)
        const center = box.getCenter(new THREE.Vector3())
        object.position.sub(center)

        scene.add(object)
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded")
      },
      (error) => {
        console.error("Erreur lors du chargement du modèle:", error)
      },
    )

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    // Gestion du redimensionnement
    const handleResize = () => {
      if (containerRef.current) {
        camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
      }
    }

    window.addEventListener("resize", handleResize)

    // Nettoyage
    return () => {
      window.removeEventListener("resize", handleResize)
      renderer.dispose()
    }
  }, [model])

  return <div ref={containerRef} className="w-full h-full rounded-lg overflow-hidden" />
}
