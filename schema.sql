CREATE TABLE IF NOT EXISTS validaciones (
    id BIGSERIAL PRIMARY KEY,
    cedula VARCHAR(11) NOT NULL,
    valido BOOLEAN NOT NULL,
    digito_verificador INTEGER,
    digito_calculado INTEGER,
    mensaje TEXT,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_validaciones_cedula ON validaciones(cedula);
CREATE INDEX idx_validaciones_fecha ON validaciones(fecha DESC);
CREATE INDEX idx_validaciones_valido ON validaciones(valido);

ALTER TABLE validaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura pública" ON validaciones
    FOR SELECT
    USING (true);

CREATE POLICY "Permitir inserción pública" ON validaciones
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Permitir eliminación pública" ON validaciones
    FOR DELETE
    USING (true);