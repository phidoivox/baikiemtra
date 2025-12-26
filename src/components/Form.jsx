import { useForm, useWatch } from "react-hook-form";
import { Glass } from "@/components/Liquidglass";

export default function Form() {
  const {
    register,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const userName = useWatch({ control, name: "name" });

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
          onSubmit={(e) => e.preventDefault()}
        >
          <h2 className="text-3xl font-bold text-white text-center drop-shadow-md mb-2">
            Nhập Tên Của Bạn
          </h2>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/90 ml-1">
              Tên đầy đủ
            </label>
            <input
              {...register("name", {
                required: "Vui lòng nhập tên của bạn",
                minLength: {
                  value: 10,
                  message: "Tên phải có ít nhất 10 ký tự",
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

          {userName && !errors.name && (
            <div className="mt-6 p-4 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-xl text-center shadow-lg transform transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-lg">
                Xin chào,{" "}
                <span className="font-bold text-yellow-300 drop-shadow-sm">
                  {userName}
                </span>
                !
              </p>
            </div>
          )}
        </form>
      </Glass>
    </div>
  );
}
