import { useState } from "react";
import { toast } from "react-toastify";
import { Check, Upload, X } from "lucide-react";
import { api } from "../api";
import Modal from "../ui/Modal";
import { Field, InputField } from "../ui/Field";
import Spinner from "../ui/Spinner";
import TagsInput from "./TagsInput";
import VehicleSelector from "./VehicleSelector";

/**
 * Subcomponente para renderizar la vista previa de las imágenes subidas o existentes.
 */
const UploadPreview = ({ file, url, text }) => (
  <div>
    <img
      src={file ? URL.createObjectURL(file) : url}
      style={{
        width: 60,
        height: 60,
        objectFit: "cover",
        borderRadius: 8,
        margin: "0 auto 8px",
        display: "block",
      }}
      alt=""
    />
    <p style={{ color: "var(--text2)", fontSize: 13 }}>{text}</p>
  </div>
);

/**
 * Formulario modal principal para la creación y edición de productos.
 * Maneja la validación extensa de datos, gestión de múltiples imágenes, 
 * características como "tags", compatibilidad con vehículos y la preparación 
 * de la data en modo 'multipart/form-data'.
 */
const ProductForm = ({ token, product, categorias, onClose, onSaved }) => {
  const isEdit = !!product;

  const [form, setForm] = useState({
    nombre: product?.nombre || "",
    sku: product?.sku || "",
    precio: product?.precio || "",
    precio_oferta: product?.precio_oferta || "",
    stock: product?.stock ?? "",
    id_categoria: product?.id_categoria || "",
    descripcion: product?.descripcion || "",
    calidad: product?.calidad || "Nacional",
    peso: product?.peso || "",
    dimensiones: product?.dimensiones || "",
    caracteristicas: product?.caracteristicas || "",
    en_oferta: product?.en_oferta || false,
  });

  const [vehiculos, setVehiculos] = useState(product?.vehiculos || []);
  const [mainImg, setMainImg] = useState(null);
  const [extraImgs, setExtraImgs] = useState([]);
  const [existingImgs, setExistingImgs] = useState(
    product?.imagenes_adicionales || [],
  );
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  const handleStockChange = (value) => {
    set("stock")(value);
    if (value === "0" || value === 0 || value === "") {
      setForm((p) => ({
        ...p,
        stock: value,
        precio_oferta: "",
        en_oferta: false,
      }));
    }
  };

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Requerido";
    if (!form.sku.trim()) e.sku = "Requerido";
    if (!form.precio || isNaN(form.precio)) e.precio = "Inválido";
    if (form.stock === "" || isNaN(form.stock)) e.stock = "Inválido";
    if (!isEdit && !mainImg) e.imagen = "Requerida";
    if (isEdit && !product?.imagen && !mainImg) e.imagen = "Requerida";

    if (form.precio_oferta !== "" && form.precio_oferta !== null) {
      const precioRegular = parseFloat(form.precio);
      const precioOferta = parseFloat(form.precio_oferta);
      if (
        !isNaN(precioRegular) &&
        !isNaN(precioOferta) &&
        precioOferta >= precioRegular
      ) {
        e.precio_oferta =
          "El precio de oferta debe ser menor al precio regular";
      }
    }

    const stockNum = parseInt(form.stock);

    if (stockNum === 0 && form.en_oferta) {
      e.en_oferta = "No puedes poner en oferta un producto sin stock";
    }

    if (
      stockNum === 0 &&
      form.precio_oferta !== "" &&
      form.precio_oferta !== null
    ) {
      e.precio_oferta = "No puedes agregar precio de oferta sin stock";
    }

    setErrors(e);
    return !Object.keys(e).length;
  };

  const deleteImg = async (imgId) => {
    setDeletingId(imgId);
    try {
      await api(
        `/api/admin/imagenes/${imgId}/eliminar/`,
        { method: "DELETE" },
        token,
      );
      setExistingImgs((p) => p.filter((i) => i.id !== imgId));
      toast.success("Imagen eliminada");
    } catch {
      toast.error("No se pudo eliminar");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const fd = new FormData();
      const NULLABLE_FIELDS = [
        "precio_oferta",
        "peso",
        "dimensiones",
        "id_categoria",
      ];
      Object.entries(form).forEach(([k, v]) => {
        if (typeof v === "boolean") {
          fd.append(k, v);
        } else if (v !== "" && v !== null) {
          fd.append(k, v);
        } else if (NULLABLE_FIELDS.includes(k)) {
          fd.append(k, "");
        }
      });
      if (mainImg) fd.append("imagen", mainImg);
      extraImgs.forEach((f) => fd.append("imagenes_adicionales", f));

      const saved = isEdit
        ? await api(
            `/api/admin/productos/${product.id_producto}/editar/`,
            { method: "PATCH", body: fd },
            token,
          )
        : await api(
            "/api/admin/productos/crear/",
            { method: "POST", body: fd },
            token,
          );

      await api(
        `/api/admin/productos/${saved.id_producto}/vehiculos/`,
        {
          method: "POST",
          body: JSON.stringify({
            vehiculos: vehiculos.map((v) => v.id_vehiculo),
          }),
        },
        token,
      );

      toast.success(isEdit ? "Producto actualizado" : "Producto creado");
      onSaved();
    } catch {
      toast.error("Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEdit ? "Editar Producto" : "Nuevo Producto"}
      onClose={onClose}
      lg
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? <Spinner /> : <Check size={16} />}
            {isEdit ? "Guardar cambios" : "Crear producto"}
          </button>
        </>
      }
    >
      {/* ── Información básica ── */}
      <div className="section-lbl">Información básica</div>
      <div className="grid2">
        <InputField
          label="Nombre"
          error={errors.nombre}
          value={form.nombre}
          onChange={set("nombre")}
          placeholder="Ej: Bomper Trasero Toyota Hilux 2006 - 2016"
        />
        <InputField
          label="SKU"
          error={errors.sku}
          value={form.sku}
          onChange={set("sku")}
          placeholder="BOMT-HLX-001"
        />
      </div>
      <div className="grid3">
        <InputField
          label="Precio regular"
          error={errors.precio}
          value={form.precio}
          onChange={set("precio")}
          type="number"
          placeholder="100.000"
        />
        <InputField
          label="Precio oferta"
          error={errors.precio_oferta}
          value={form.precio_oferta}
          onChange={set("precio_oferta")}
          type="number"
          placeholder="50.000"
          disabled={parseInt(form.stock) === 0}
        />
        <InputField
          label="Stock"
          error={errors.stock}
          value={form.stock}
          onChange={handleStockChange}
          type="number"
          placeholder="100"
        />
      </div>

      {/* ── Detalles ── */}
      <div className="section-lbl">Detalles</div>
      <div className="grid2">
        <Field label="Categoría">
          <select
            className="input"
            value={form.id_categoria}
            onChange={(e) => set("id_categoria")(e.target.value)}
          >
            <option value="">Sin categoría</option>
            {categorias.map((c) => (
              <option key={c.id_categoria} value={c.id_categoria}>
                {c.nombre}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Calidad">
          <select
            className="input"
            value={form.calidad}
            onChange={(e) => set("calidad")(e.target.value)}
          >
            <option>Nacional</option>
            <option>Importado</option>
          </select>
        </Field>
        <InputField
          label="Peso (kg)"
          error={errors.peso}
          value={form.peso}
          onChange={set("peso")}
          type="number"
          placeholder="0.5"
        />
        <InputField
          label="Dimensiones"
          error={errors.dimensiones}
          value={form.dimensiones}
          onChange={set("dimensiones")}
          placeholder="10x5x3 cm"
        />
      </div>
      <Field label="Descripción">
        <textarea
          className="input"
          rows={3}
          value={form.descripcion}
          onChange={(e) => set("descripcion")(e.target.value)}
          placeholder="Descripción detallada..."
        />
      </Field>
      <Field label="Características (separadas por coma)">
        <TagsInput
          value={form.caracteristicas}
          onChange={set("caracteristicas")}
        />
      </Field>

      {/* ── Toggle oferta ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          background: form.en_oferta ? "rgba(230,0,0,0.04)" : "var(--bg3)",
          border: `1px solid ${form.en_oferta ? "rgba(230,0,0,0.2)" : "var(--border)"}`,
          padding: "14px 16px",
          borderRadius: 13,
          transition: "all .2s",
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>¿En oferta?</div>
          <div style={{ fontSize: 11.5, color: "var(--text2)", marginTop: 2 }}>
            Aparecerá en la sección de ofertas del catálogo
          </div>
        </div>
        <div
          style={{
            position: "relative",
            width: 44,
            height: 24,
            cursor: "pointer",
            flexShrink: 0,
          }}
          onClick={() =>
            parseInt(form.stock) > 0 && set("en_oferta")(!form.en_oferta)
          }
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 12,
              background: form.en_oferta ? "var(--accent)" : "var(--border2)",
              transition: "background .2s",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 3,
              left: form.en_oferta ? 23 : 3,
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "white",
              transition: "left .2s",
              boxShadow: "0 1px 4px rgba(0,0,0,.4)",
            }}
          />
        </div>
      </div>

      {/* ── Imágenes ── */}
      <div className="section-lbl">Imágenes</div>
      <div className="grid2">
        <Field label="Imagen principal" error={errors.imagen}>
          <div className="upload-zone" style={{ borderColor: errors.imagen ? "var(--danger)" : undefined }}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setMainImg(e.target.files[0])}
            />
            {mainImg ? (
              <UploadPreview file={mainImg} text={mainImg.name} />
            ) : product?.imagen ? (
              <UploadPreview url={product.imagen} text="Clic para cambiar" />
            ) : (
              <div>
                <Upload size={28} color="var(--text3)" />
                <p
                  style={{ color: "var(--text2)", fontSize: 13, marginTop: 8 }}
                >
                  Subir imagen principal
                </p>
                <p style={{ color: "var(--text3)", fontSize: 12 }}>
                  PNG, JPG, WEBP
                </p>
              </div>
            )}
          </div>
        </Field>

        <Field label="Imágenes adicionales">
          {existingImgs.length > 0 && (
            <>
              <p
                style={{
                  fontSize: 11,
                  color: "var(--text2)",
                  marginBottom: 6,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                }}
              >
                Guardadas ({existingImgs.length})
              </p>
              <div className="gallery">
                {existingImgs.map((img) => (
                  <div
                    key={img.id}
                    className="gallery-thumb"
                    style={{ opacity: deletingId === img.id ? 0.4 : 1 }}
                  >
                    <img src={img.imagen} alt="" />
                    <button
                      className="gallery-remove"
                      style={{ background: "var(--accent)" }}
                      onClick={() => deleteImg(img.id)}
                      disabled={deletingId === img.id}
                    >
                      {deletingId === img.id ? "…" : <X size={9} />}
                    </button>
                  </div>
                ))}
              </div>
              <div
                style={{
                  height: 1,
                  background: "var(--border)",
                  margin: "12px 0",
                }}
              />
            </>
          )}
          <div className="upload-zone">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setExtraImgs([...e.target.files])}
            />
            <Upload size={24} color="var(--text3)" />
            <p style={{ color: "var(--text2)", fontSize: 13, marginTop: 8 }}>
              Subir galería
            </p>
            <p style={{ color: "var(--text3)", fontSize: 12 }}>
              Selecciona múltiples archivos
            </p>
          </div>
          {extraImgs.length > 0 && (
            <div className="gallery" style={{ marginTop: 8 }}>
              {extraImgs.map((f, i) => (
                <div
                  key={i}
                  className="gallery-thumb"
                  style={{ border: "1px solid rgba(230,0,0,0.3)" }}
                >
                  <img src={URL.createObjectURL(f)} alt="" />
                  <button
                    className="gallery-remove"
                    onClick={() =>
                      setExtraImgs(extraImgs.filter((_, j) => j !== i))
                    }
                  >
                    <X size={9} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Field>
      </div>

      {/* ── Vehículos ── */}
      <div className="section-lbl">Vehículos compatibles</div>
      <VehicleSelector
        token={token}
        selected={vehiculos}
        onChange={setVehiculos}
      />
    </Modal>
  );
};

export default ProductForm;