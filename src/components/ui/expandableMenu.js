"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faChevronDown,
  faHeartPulse,
  faCircle,
  faBatteryFull,
  faMars,
  faVenus,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";
import { Logo } from "@/components/ui/logo";
import Image from "next/image";
import { getAnimalInfo, getLatestBatimentos } from "@/utils/api";

export function ExpandableMenu({ animalId, backgroundColor = "white" }) {
  const [expanded, setExpanded] = useState(false);
  const [batimento, setBatimento] = useState(null);
  const [animalInfo, setAnimalInfo] = useState(null);
  const [loading, setloading] = useState(false);
  const [batimentoError, setBatimentoError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setloading(true);

        const [batimento, info] = await Promise.all([
          getLatestBatimentos(animalId),
          getAnimalInfo(animalId)
        ]);

        setBatimento(batimento);
        setAnimalInfo(info);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setBatimentoError(error.message);
      } finally {
        setloading(false);
      }
    };

    if (animalId) {
      fetchData();
    }
  }, [animalId]);

  return (
    <div
      className={`
        fixed bottom-20 rounded-t-[40px] p-4
        transition-all duration-300 overflow-hidden
        ${expanded ? "h-[65vh]" : "h-[180px]"}
        shadow-lg
        left-0 right-0
        lg:left-0 lg:right-auto lg:w-[400px]
      `}
      style={{ backgroundColor }}
    >
      {/* Cabeçalho com botão e logo */}
      <div className="relative mb-2">
        <div className="flex justify-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="bg-[var(--color-orange)] rounded-full px-12 py-0 flex items-center"
          >
            <FontAwesomeIcon
              icon={expanded ? faChevronDown : faChevronUp}
              className="text-white text-xl"
            />
          </button>
        </div>

        <div className="absolute right-0 top-0">
          <Logo className="h-10 w-auto lg:h-10" />
        </div>
      </div>

      {/* Container interno */}
      <div className="w-full max-w-md lg:max-w-full mx-auto pt-6 lg:pt-8 mt-4 lg:mt-2">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Image
              src="/uno.png"
              alt="Pet Uno"
              width={80}
              height={80}
              className="rounded-full border-4 border-[var(--color-orange)]"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  {animalInfo?.nome ? (
                    animalInfo.nome
                  ) : (
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="text-blue-500 text-xl flex-shrink-0"
                    />
                  )}

                  {animalInfo?.sexo ? (
                    animalInfo?.sexo == "M" ? (
                      <FontAwesomeIcon
                        icon={faMars}
                        className="text-blue-500 text-xl flex-shrink-0"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faVenus}
                        className="text-blue-500 text-xl flex-shrink-0"
                      />
                    )
                  ) : (
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="text-blue-500 text-xl flex-shrink-0"
                    />
                  )}
                </h2>
              </div>

              {/* Batimentos */}
              <div className="flex items-center gap-1 flex-shrink-0 ml-2 lg:ml-0">
                <span className="text-2xl font-bold">
                  {loading ? (
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="text-blue-500 text-xl flex-shrink-0"
                    />
                  ) : (
                    batimento ?? (
                      <FontAwesomeIcon
                        icon={faSpinner}
                        className="text-blue-500 text-xl flex-shrink-0"
                      />
                    )
                  )}
                </span>
                <FontAwesomeIcon
                  icon={faHeartPulse}
                  className="text-red-500 text-xl"
                />
                <span className="text-base font-bold ml-1">BPM</span>
              </div>
            </div>

            {/* Status + bateria */}
            <div className="flex flex-row justify-between items-center mt-4 w-full">
              {/* Status da PetDex */}
              <div className="flex items-center gap-1 font-medium whitespace-nowrap text-xs sm:text-sm">
                <span>Status da PetDex:</span>
                <FontAwesomeIcon
                  icon={faCircle}
                  className="text-green-500 text-[11px]"
                />
                <span>Conectada</span>
              </div>

              {/* Bateria */}
              <div className="flex items-center gap-1 font-medium text-xs sm:text-sm">
                <FontAwesomeIcon
                  icon={faBatteryFull}
                  className="text-green-500 text-xl -rotate-90"
                />
                <span>96%</span>
              </div>
            </div>
          </div>
        </div>

        {expanded && (
          <div className="mt-6 pt-4 border-t border-[var(--color-gray-medium)]">
            <p className="text-center text-gray-500">Menu expandido</p>
          </div>
        )}
      </div>
    </div>
  );
}
