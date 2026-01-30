"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { ARButton } from "three/examples/jsm/webxr/ARButton"
import type { ARModel } from "@/lib/services/ar-service"

interface ARViewerProps {
  model: ARModel
}

export default function ARViewer({ model }: ARViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Initialiser Three.js
    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.xr.enabled = true
    rendererRef.current = renderer

    containerRef.current.innerHTML = ""
    containerRef.current.appendChild(renderer.domElement)

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
        object.position.set(model.position.x, model.position.y, model.position.z)
        object.rotation.set(model.rotation.x, model.rotation.y, model.rotation.z)

        scene.add(object)
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded")
      },
      (error) => {
        console.error("Erreur lors du chargement du modèle:", error)
      },
    )

    // Ajouter le bouton AR
    if ("xr" in navigator) {
      const arButton = ARButton.createButton(renderer, {
        requiredFeatures: ["hit-test"],
        optionalFeatures: ["dom-overlay"],
        domOverlay: { root: document.body },
      })

      arButton.style.position = "absolute"
      arButton.style.bottom = "20px"
      arButton.style.left = "50%"
      arButton.style.transform = "translateX(-50%)"
      arButton.style.padding = "12px 24px"
      arButton.style.border = "none"
      arButton.style.borderRadius = "4px"
      arButton.style.backgroundColor = "var(--primary)"
      arButton.style.color = "white"
      arButton.style.fontWeight = "bold"
      arButton.style.zIndex = "100"

      containerRef.current.appendChild(arButton)
    }

    // Animation loop
    const animate = () => {
      if (rendererRef.current) {
        rendererRef.current.setAnimationLoop(() => {
          if (rendererRef.current && sceneRef.current && cameraRef.current) {
            rendererRef.current.render(sceneRef.current, cameraRef.current)
          }
        })
      }
    }

    animate()

    // Gestion du redimensionnement
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight
        cameraRef.current.updateProjectionMatrix()
        rendererRef.current.setSize(window.innerWidth, window.innerHeight)
      }
    }

    window.addEventListener("resize", handleResize)

    // Nettoyage
    return () => {
      window.removeEventListener("resize", handleResize)
      if (rendererRef.current) {
        rendererRef.current.setAnimationLoop(null)
        rendererRef.current.dispose()
      }
    }
  }, [model])

  return <div ref={containerRef} className="w-full h-full" />
}
