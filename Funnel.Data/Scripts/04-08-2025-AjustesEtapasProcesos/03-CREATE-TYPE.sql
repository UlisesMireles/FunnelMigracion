DROP TYPE ProcesosEtapas;

CREATE TYPE ProcesosEtapas AS TABLE (
	RIdProcesoEtapa int NULL,
	IdProceso int NULL,
	IdStage int NULL,
	Estatus bit NULL,
	PorcentajeAsignado int NULL,
	Orden int NULL
);