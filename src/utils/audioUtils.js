let mediaRecorder = null
let audioChunks = []

export const startRecording = async () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    console.warn("Recording not supported on the server.")
    return
  }

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  mediaRecorder = new MediaRecorder(stream)
  audioChunks = []

  mediaRecorder.ondataavailable = (event) => {
    audioChunks.push(event.data)
  }

  mediaRecorder.start()
}

export const stopRecording = () => {
  return new Promise((resolve) => {
    if (mediaRecorder) {
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
        resolve(audioBlob)
      }
      mediaRecorder.stop()
    } else {
      resolve(null)
    }
  })
}
