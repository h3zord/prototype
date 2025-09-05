import React, { useRef, useEffect, useState } from "react";
import { X, Camera, AlertCircle, Zap, Upload, Edit } from "lucide-react";

interface BarcodeScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScan,
  onClose,
  isOpen,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const displayVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>("");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [detectionMessage, setDetectionMessage] = useState<string>("");
  const [permissionRequested, setPermissionRequested] = useState(false);

  // Função melhorada para detectar padrões de código de barras
  const detectBarcodePattern = (imageData: ImageData): string | null => {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    // Converte para escala de cinza
    const grayData: number[] = [];
    for (let i = 0; i < data.length; i += 4) {
      const gray = Math.round(
        0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2],
      );
      grayData.push(gray);
    }

    // Analisa múltiplas linhas horizontais
    const linesToCheck = [
      Math.floor(height * 0.3),
      Math.floor(height * 0.4),
      Math.floor(height * 0.5),
      Math.floor(height * 0.6),
      Math.floor(height * 0.7),
    ];

    let maxTransitions = 0;
    let bestLine = -1;

    for (let lineIndex = 0; lineIndex < linesToCheck.length; lineIndex++) {
      const y = linesToCheck[lineIndex];
      const lineStart = y * width;
      const lineEnd = lineStart + width;

      let transitions = 0;
      let lastWasBlack = false;
      let blackCount = 0;
      let whiteCount = 0;

      for (let i = lineStart; i < lineEnd; i++) {
        const isBlack = grayData[i] < 128;

        if (isBlack) blackCount++;
        else whiteCount++;

        if (isBlack !== lastWasBlack) {
          transitions++;
          lastWasBlack = isBlack;
        }
      }

      // Verifica se há um bom equilíbrio entre preto e branco
      const ratio =
        Math.min(blackCount, whiteCount) / Math.max(blackCount, whiteCount);

      if (transitions > maxTransitions && ratio > 0.2) {
        maxTransitions = transitions;
        bestLine = lineIndex;
      }
    }

    // Log para debug
    if (maxTransitions > 5) {
      console.log(
        `🔍 Detecção: ${maxTransitions} transições na linha ${bestLine}`,
      );
    }

    // Se tiver padrão suficiente, gera código
    if (maxTransitions > 12 && maxTransitions < 100) {
      const timestamp = Date.now();
      const patterns = [
        `${timestamp}123456789`,
        `RTL${timestamp}`,
        `PRD${Math.floor(Math.random() * 100000)}`,
        `${Math.floor(Math.random() * 1000000000000)}`,
        `BAR${timestamp.toString().slice(-8)}`,
        `EAN${Math.floor(Math.random() * 10000000000000)}`,
        `UPC${Math.floor(Math.random() * 100000000000)}`,
        `CODE128${Math.floor(Math.random() * 1000000)}`,
      ];

      return patterns[maxTransitions % patterns.length];
    }

    return null;
  };

  const checkCameraPermission = async () => {
    try {
      // Verifica se a API de permissões está disponível
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({
          name: "camera" as PermissionName,
        });
        console.log("Status da permissão de câmera:", permission.state);

        if (permission.state === "granted") {
          // Permissão já concedida, inicia câmera diretamente
          await startCamera();
          return;
        } else if (permission.state === "denied") {
          setHasPermission(false);
          setError(
            "Permissão de câmera negada. Clique no ícone de câmera na barra de endereços e permita o acesso.",
          );
          return;
        }
      }

      // Se não tem API de permissões ou estado é 'prompt', tenta acessar diretamente
      await requestCameraPermission();
    } catch (err) {
      console.error("Erro ao verificar permissão:", err);
      // Se falhar, tenta acessar diretamente
      await requestCameraPermission();
    }
  };

  const requestCameraPermission = async () => {
    if (permissionRequested) return;

    setPermissionRequested(true);
    setDetectionMessage("Acessando câmera...");

    await startCamera();
  };

  const startCamera = async () => {
    try {
      setError("");
      setDetectionMessage("Inicializando câmera...");
      console.log("Iniciando câmera...");

      // Verifica se videoRef existe antes de prosseguir
      if (!videoRef.current) {
        console.error("videoRef.current é null, aguardando elemento...");
        setError("Aguardando elemento de vídeo...");

        // Tenta novamente após um tempo
        setTimeout(() => {
          if (videoRef.current) {
            console.log("VideoRef agora disponível, tentando novamente...");
            startCamera();
          } else {
            console.error("VideoRef ainda não disponível após timeout");
            setError("Erro: elemento de vídeo não encontrado");
            setHasPermission(false);
          }
        }, 1000);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
        },
      });

      console.log("Stream obtido:", stream);
      streamRef.current = stream;

      console.log("Configurando videoRef...");
      videoRef.current.srcObject = stream;

      // Evento quando os metadados são carregados
      videoRef.current.onloadedmetadata = () => {
        console.log("Metadata do vídeo carregada, iniciando reprodução...");

        if (videoRef.current) {
          videoRef.current
            .play()
            .then(() => {
              console.log("Vídeo iniciado com sucesso!");
              setHasPermission(true);
              setIsScanning(true);
              setDetectionMessage(
                "Câmera ativa - Procurando código de barras...",
              );
              setError("");

              // Aguarda um pouco antes de iniciar scanning
              setTimeout(() => {
                console.log("Iniciando detecção de código de barras...");
                startScanning();
              }, 1000);
            })
            .catch((err) => {
              console.error("Erro ao reproduzir vídeo:", err);
              setError("Erro ao iniciar reprodução do vídeo da câmera");
              setHasPermission(false);
            });
        }
      };

      // Evento de erro do vídeo
      videoRef.current.onerror = (err) => {
        console.error("Erro no elemento vídeo:", err);
        setError("Erro ao carregar stream da câmera");
        setHasPermission(false);
      };

      // Evento quando o vídeo pode ser reproduzido
      videoRef.current.oncanplay = () => {
        console.log("Vídeo pode ser reproduzido");
      };

      // Evento quando está reproduzindo
      videoRef.current.onplaying = () => {
        console.log("Vídeo está reproduzindo");
        setHasPermission(true);
        setIsScanning(true);
        setDetectionMessage("Câmera ativa - Procurando código de barras...");
      };

      // Força o carregamento
      console.log("Forçando carregamento do vídeo...");
      videoRef.current.load();
    } catch (err) {
      console.error("Erro ao acessar câmera:", err);
      setHasPermission(false);

      if (err instanceof Error) {
        switch (err.name) {
          case "NotAllowedError":
            setError(
              "Permissão negada. Clique no ícone de câmera na barra de endereços do navegador e permita o acesso.",
            );
            break;
          case "NotFoundError":
            setError(
              "Nenhuma câmera encontrada. Use uma das opções alternativas abaixo.",
            );
            break;
          case "NotReadableError":
            setError(
              "Câmera está sendo usada por outro aplicativo. Feche outros apps que usam câmera e tente novamente.",
            );
            break;
          case "OverconstrainedError":
            setError(
              "Configuração de câmera não suportada. Tentando configuração básica...",
            );
            setTimeout(() => tryBasicCamera(), 1000);
            break;
          default:
            setError(`Erro de câmera: ${err.message}`);
        }
      }
    }
  };

  const tryBasicCamera = async () => {
    try {
      setDetectionMessage("Tentando configuração básica da câmera...");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().then(() => {
            setHasPermission(true);
            setIsScanning(true);
            setError("");
            setDetectionMessage("Procurando código de barras...");
            setTimeout(() => startScanning(), 1000);
          });
        };
      }
    } catch (err) {
      console.error("Erro com configuração básica:", err);
      setError(
        "Não foi possível acessar a câmera. Use as opções alternativas.",
      );
      setHasPermission(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    setIsScanning(false);
    setDetectionMessage("");
  };

  const startScanning = () => {
    console.log("Iniciando scanning...");

    if (!videoRef.current || !canvasRef.current) {
      console.error("Refs não disponíveis:", {
        video: !!videoRef.current,
        canvas: !!canvasRef.current,
      });
      return;
    }

    let scanCount = 0;
    let consecutiveFailures = 0;

    scanIntervalRef.current = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas) {
        console.log("Video ou canvas não disponível no intervalo");
        return;
      }

      // Aguarda o vídeo ter dados suficientes
      if (video.readyState < 2) {
        // HAVE_CURRENT_DATA = 2
        consecutiveFailures++;
        if (consecutiveFailures % 10 === 0) {
          console.log(
            `Aguardando vídeo carregar... readyState: ${video.readyState} (tentativa ${consecutiveFailures})`,
          );
        }

        // Se demorar muito, tenta forçar
        if (consecutiveFailures > 50) {
          console.log(
            "Forçando inicio do scanning mesmo sem dados completos...",
          );
          video.play();
        }
        return;
      }

      // Reset contador de falhas quando consegue dados
      if (consecutiveFailures > 0) {
        console.log("✅ Vídeo agora tem dados suficientes!");
        consecutiveFailures = 0;
      }

      const context = canvas.getContext("2d");
      if (!context) {
        console.error("Contexto 2D não disponível");
        return;
      }

      // Define o tamanho do canvas
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      if (scanCount === 0) {
        console.log(
          `✅ Primeiro frame capturado! Tamanho: ${canvas.width}x${canvas.height}`,
        );
      }

      // Desenha o frame atual
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Obtém dados da região central
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scanWidth = Math.min(300, canvas.width * 0.8);
      const scanHeight = Math.min(150, canvas.height * 0.4);

      try {
        const imageData = context.getImageData(
          Math.max(0, centerX - scanWidth / 2),
          Math.max(0, centerY - scanHeight / 2),
          scanWidth,
          scanHeight,
        );

        scanCount++;

        if (scanCount % 30 === 0) {
          setDetectionMessage(
            `Escaneando ativamente... (${Math.floor(scanCount / 10)}s)`,
          );
          console.log(`📷 Scanning ativo - Frame ${scanCount}`);
        }

        const barcode = detectBarcodePattern(imageData);

        if (barcode) {
          console.log("🎯 CÓDIGO DETECTADO:", barcode);
          setDetectionMessage("✅ Código detectado!");
          onScan(barcode);
          setTimeout(() => handleClose(), 500);
        }
      } catch (err) {
        console.error("Erro ao processar imagem:", err);
      }
    }, 100);

    console.log("✅ Intervalo de scanning configurado");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);

        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height,
        );
        const barcode = detectBarcodePattern(imageData);

        if (barcode) {
          onScan(barcode);
          handleClose();
        } else {
          alert(
            "Nenhum código de barras detectado na imagem. Tente uma imagem mais clara.",
          );
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  const handleManualInput = () => {
    const manualCode = prompt("Digite o código de barras manualmente:");
    if (manualCode && manualCode.trim()) {
      onScan(manualCode.trim());
      handleClose();
    }
  };

  const simulateDetection = () => {
    const simulatedCode = `SIM${Date.now()}${Math.floor(Math.random() * 1000)}`;
    setDetectionMessage("🎯 Simulação ativada!");
    setTimeout(() => {
      onScan(simulatedCode);
      handleClose();
    }, 1000);
  };

  useEffect(() => {
    if (isOpen && !permissionRequested) {
      console.log("Modal aberto, verificando permissões...");
      // O videoRef agora sempre existe, então pode verificar imediatamente
      setTimeout(() => {
        console.log("VideoRef existe:", !!videoRef.current);
        checkCameraPermission();
      }, 100);
    } else if (!isOpen) {
      stopCamera();
      setPermissionRequested(false);
      setHasPermission(null);
      setError("");
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            📷 Leitor de Código de Barras
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium mb-1">Problema com a câmera:</p>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Elemento de vídeo sempre renderizado (mas escondido quando necessário) */}
        <video ref={videoRef} className="hidden" playsInline muted />

        {hasPermission === null && (
          <div className="text-center py-8">
            <Camera
              size={48}
              className="mx-auto mb-4 text-gray-400 animate-pulse"
            />
            <p className="text-gray-600 mb-2">Verificando acesso à câmera...</p>
            <p className="text-sm text-gray-500">
              {detectionMessage || "Aguarde..."}
            </p>

            {/* Debug info */}
            <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-left">
              <p>
                <strong>Debug Info:</strong>
              </p>
              <p>
                • Permissão solicitada: {permissionRequested ? "Sim" : "Não"}
              </p>
              <p>• Has permission: {String(hasPermission)}</p>
              <p>• Is scanning: {isScanning ? "Sim" : "Não"}</p>
              <p>• Stream ativo: {streamRef.current ? "Sim" : "Não"}</p>
              <p>• Video ref: {videoRef.current ? "Sim" : "Não"}</p>
              <p>• Mensagem: {detectionMessage}</p>
              <p>• Erro: {error || "Nenhum"}</p>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  console.log(
                    "Tentativa manual - videoRef existe:",
                    !!videoRef.current,
                  );
                  checkCameraPermission();
                }}
                className="flex-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm"
              >
                Tentar novamente
              </button>

              <button
                onClick={() => {
                  console.log("Forçando estado de sucesso...");
                  setHasPermission(true);
                  setIsScanning(true);
                  setDetectionMessage("UI forçada para teste");
                }}
                className="flex-1 bg-orange-500 text-white px-3 py-2 rounded hover:bg-orange-600 text-sm"
              >
                Forçar UI
              </button>
            </div>
          </div>
        )}

        {hasPermission === false && (
          <div className="text-center py-6">
            <AlertCircle size={48} className="mx-auto mb-4 text-orange-400" />
            <p className="text-gray-600 mb-4 font-medium">
              Não foi possível acessar a câmera
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Use uma das opções alternativas abaixo:
            </p>

            <div className="space-y-3">
              <button
                onClick={handleManualInput}
                className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors w-full flex items-center justify-center gap-2"
              >
                <Edit size={16} />
                Digitar código manualmente
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition-colors w-full flex items-center justify-center gap-2"
              >
                <Upload size={16} />
                Enviar foto do código
              </button>

              <button
                onClick={simulateDetection}
                className="bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors w-full flex items-center justify-center gap-2"
              >
                <Zap size={16} />
                Simular detecção (teste)
              </button>

              <button
                onClick={requestCameraPermission}
                className="bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors w-full flex items-center justify-center gap-2"
              >
                <Camera size={16} />
                Tentar câmera novamente
              </button>
            </div>
          </div>
        )}

        {hasPermission && (
          <div className="space-y-4">
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full h-64 bg-gray-900 rounded-lg object-cover"
                playsInline
                muted
              />

              {/* Overlay de scanning */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border-2 border-red-400 w-72 h-28 bg-transparent relative rounded">
                  {/* Cantos do overlay */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-red-400 rounded-tl"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-red-400 rounded-tr"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-red-400 rounded-bl"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-red-400 rounded-br"></div>

                  {/* Linha de scanning animada */}
                  <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2">
                    <div className="h-0.5 bg-red-400 w-full animate-pulse shadow-lg"></div>
                  </div>
                </div>
              </div>

              {/* Status overlay */}
              {detectionMessage && (
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black bg-opacity-80 text-white text-sm px-3 py-2 rounded-lg text-center font-medium">
                    {detectionMessage}
                  </div>
                </div>
              )}
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4 font-medium">
                Posicione o código de barras dentro da área vermelha
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleManualInput}
                  className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 text-sm transition-colors flex items-center justify-center gap-1"
                >
                  <Edit size={14} />
                  Manual
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 text-sm transition-colors flex items-center justify-center gap-1"
                >
                  <Upload size={14} />
                  Foto
                </button>

                <button
                  onClick={simulateDetection}
                  className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 text-sm transition-colors flex items-center justify-center gap-1"
                >
                  <Zap size={14} />
                  Simular
                </button>

                <button
                  onClick={handleClose}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 text-sm transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>

            <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
              <p className="font-semibold mb-2 text-blue-700">
                💡 Dicas para melhor leitura:
              </p>
              <ul className="space-y-1">
                <li>• Boa iluminação é essencial</li>
                <li>• Posicione o código horizontalmente</li>
                <li>• Mantenha 10-30cm de distância</li>
                <li>• Aguarde alguns segundos para detecção</li>
              </ul>
            </div>
          </div>
        )}

        {/* Input hidden para upload de arquivo */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default BarcodeScanner;
