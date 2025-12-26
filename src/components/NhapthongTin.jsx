import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import GlassButton, { Glass } from "@/components/Liquidglass";
import Toast from "@/components/Toast";

export default function Form() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const [showToast, setShowToast] = useState(false);

  const onSubmit = (data) => {
    console.log(data);
    setShowToast(true);
  };

  const formValues = useWatch({ control });
  const { name, studentClass, address } = formValues || {};

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat p-4 relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=2544&auto=format&fit=crop')",
      }}
    >
      <div className="absolute inset-0 bg-white/10 z-0"></div>

      <Glass variant="default" className="max-w-md w-full rounded-2xl z-10">
        <form
          className="w-full p-8 space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h2 className="text-3xl font-bold text-white text-center drop-shadow-md mb-2">
            Nhập Thông Tin Sinh Viên
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90 ml-1">
                Tên sinh viên
              </label>
              <input
                {...register("name", {
                  required: "Vui lòng nhập tên sinh viên",
                  minLength: {
                    value: 2,
                    message: "Tên phải có ít nhất 2 ký tự",
                  },
                  maxLength: {
                    value: 50,
                    message: "Tên không được vượt quá 50 ký tự",
                  },
                  pattern: {
                    value: /^[\p{L} ]+$/u,
                    message: "Tên phải là chữ",
                  },
                })}
                className={`w-full px-4 py-3 border rounded-xl outline-none transition-all duration-300 backdrop-blur-sm
                                ${
                                  errors.name
                                    ? "border-red-400 bg-red-500/10 focus:border-red-300 text-white placeholder-red-200"
                                    : "border-white/20 bg-white/10 focus:bg-white/20 focus:border-white/50 text-white placeholder-white/50"
                                }`}
                placeholder="vd: Nam Đẹp Trai"
                autoComplete="off"
              />

              {errors.name && (
                <p className="text-red-200 text-sm font-medium ml-1 bg-red-500/20 py-1 px-2 rounded-md inline-block backdrop-blur-md">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90 ml-1">
                Lớp
              </label>
              <select
                {...register("studentClass", {
                  required: "Vui lòng chọn lớp",
                })}
                className={`w-full px-4 py-3 border rounded-xl outline-none transition-all duration-300 backdrop-blur-sm
                                ${
                                  errors.studentClass
                                    ? "border-red-400 bg-red-500/10 focus:border-red-300 text-white"
                                    : "border-white/20 bg-white/10 focus:bg-white/20 focus:border-white/50 text-white"
                                }`}
              >
                <option value="" className="text-black">
                  -- Chọn lớp --
                </option>
                <option value="24CNTT1A" className="text-black">
                  24CNTT1A
                </option>
                <option value="24CNTT1B" className="text-black">
                  24CNTT1B
                </option>
                <option value="24CNTT1C" className="text-black">
                  24CNTT1C
                </option>
                <option value="24CNTT1D" className="text-black">
                  24CNTT1D
                </option>
                <option value="24CNTT1E" className="text-black">
                  24CNTT1E
                </option>
                <option value="24CNTT1F" className="text-black">
                  24CNTT1F
                </option>
              </select>

              {errors.studentClass && (
                <p className="text-red-200 text-sm font-medium ml-1 bg-red-500/20 py-1 px-2 rounded-md inline-block backdrop-blur-md">
                  {errors.studentClass.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90 ml-1">
                Địa chỉ
              </label>
              <input
                {...register("address", {
                  required: "Vui lòng nhập địa chỉ",
                })}
                className={`w-full px-4 py-3 border rounded-xl outline-none transition-all duration-300 backdrop-blur-sm
                                ${
                                  errors.address
                                    ? "border-red-400 bg-red-500/10 focus:border-red-300 text-white placeholder-red-200"
                                    : "border-white/20 bg-white/10 focus:bg-white/20 focus:border-white/50 text-white placeholder-white/50"
                                }`}
                placeholder="vd: Hà Nội"
                autoComplete="off"
              />

              {errors.address && (
                <p className="text-red-200 text-sm font-medium ml-1 bg-red-500/20 py-1 px-2 rounded-md inline-block backdrop-blur-md">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>

          {name && studentClass && address && (
            <div className="mt-6 p-4 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-xl shadow-lg transform transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <p className="text-lg">
                  Sinh viên:{" "}
                  <span className="font-bold text-yellow-300 drop-shadow-sm">
                    {name}
                  </span>
                </p>
                <p className="text-lg">
                  Lớp:{" "}
                  <span className="font-bold text-yellow-300 drop-shadow-sm">
                    {studentClass}
                  </span>
                </p>
                <p className="text-lg">
                  Địa chỉ:{" "}
                  <span className="font-bold text-yellow-300 drop-shadow-sm">
                    {address}
                  </span>
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-center pt-2">
            <GlassButton
              type="submit"
              variant="default"
              size="md"
              className="font-bold text-yellow-300 drop-shadow-sm"
            >
              Lưu Thông Tin
            </GlassButton>
          </div>
        </form>
      </Glass>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50">
          <Toast
            type="success"
            title="Thành công!"
            message="Đã thêm vào CSDL"
            onClose={() => setShowToast(false)}
            duration={3000}
          />
        </div>
      )}
    </div>
  );
}
