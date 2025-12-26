import React, { useState } from "react";
import { useForm } from "react-hook-form";
import GlassButton, { Glass } from "@/components/Liquidglass";
import Toast from "@/components/Toast";

const StudentManager = () => {
  const [students, setStudents] = useState([]);
  const [showToast, setShowToast] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const handleAdd = (data) => {
    setStudents([
      ...students,
      {
        id: students.length + 1,
        name: data.name,
        studentClass: data.studentClass,
        address: data.address,
        phone: data.phone,
      },
    ]);
    reset();
    setShowToast(true);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat p-4 relative overflow-y-auto"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=2544&auto=format&fit=crop')",
      }}
    >
      <div className="fixed inset-0 bg-white/10 z-0"></div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-8 pt-10 pb-10">
        {/* Input Section */}
        <Glass
          variant="default"
          backgroundOpacity={0.15}
          blur={12}
          className="w-full rounded-2xl"
        >
          <div className="w-full p-8">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/20 pb-4 uppercase text-center md:text-left drop-shadow-md">
              Thêm mới sinh viên
            </h2>
            <form
              onSubmit={handleSubmit(handleAdd)}
              className="flex flex-col gap-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name validation */}
                <div className="relative">
                  <label className="text-white mb-1 block font-medium ml-1">
                    Tên sinh viên
                  </label>
                  <input
                    type="text"
                    {...register("name", {
                      required: "Vui lòng nhập tên sinh viên",
                      minLength: {
                        value: 2,
                        message: "Tên phải có ít nhất 2 ký tự",
                      },
                      pattern: {
                        value: /^[\p{L} ]+$/u,
                        message: "Tên phải là chữ",
                      },
                    })}
                    placeholder="Nhập tên..."
                    className={`w-full px-4 py-3 border rounded-xl outline-none transition-all duration-300 backdrop-blur-md text-white placeholder-white/70 shadow-inner ${
                      errors.name
                        ? "border-red-400 bg-red-500/10 focus:border-red-300"
                        : "border-white/30 bg-white/20 focus:bg-white/30 focus:border-white/60 focus:ring-2 focus:ring-white/20"
                    }`}
                  />
                  {errors.name && (
                    <p className="absolute -bottom-6 left-0 text-red-300 text-sm font-medium drop-shadow-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Class validation */}
                <div className="relative">
                  <label className="text-white mb-1 block font-medium ml-1">
                    Lớp
                  </label>
                  <select
                    {...register("studentClass", {
                      required: "Vui lòng chọn lớp",
                    })}
                    className={`w-full px-4 py-3 border rounded-xl outline-none transition-all duration-300 backdrop-blur-md text-white shadow-inner appearance-none ${
                      errors.studentClass
                        ? "border-red-400 bg-red-500/10 focus:border-red-300"
                        : "border-white/30 bg-white/20 focus:bg-white/30 focus:border-white/60 focus:ring-2 focus:ring-white/20"
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
                  </select>
                  {errors.studentClass && (
                    <p className="absolute -bottom-6 left-0 text-red-300 text-sm font-medium drop-shadow-sm">
                      {errors.studentClass.message}
                    </p>
                  )}
                </div>

                {/* Address validation */}
                <div className="relative">
                  <label className="text-white mb-1 block font-medium ml-1">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    {...register("address", {
                      required: "Vui lòng nhập địa chỉ",
                    })}
                    placeholder="Nhập địa chỉ..."
                    className={`w-full px-4 py-3 border rounded-xl outline-none transition-all duration-300 backdrop-blur-md text-white placeholder-white/70 shadow-inner ${
                      errors.address
                        ? "border-red-400 bg-red-500/10 focus:border-red-300"
                        : "border-white/30 bg-white/20 focus:bg-white/30 focus:border-white/60 focus:ring-2 focus:ring-white/20"
                    }`}
                  />
                  {errors.address && (
                    <p className="absolute -bottom-6 left-0 text-red-300 text-sm font-medium drop-shadow-sm">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                {/* Phone validation */}
                <div className="relative">
                  <label className="text-white mb-1 block font-medium ml-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    {...register("phone", {
                      required: "Vui lòng nhập SĐT",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "SĐT phải là 10 số",
                      },
                    })}
                    placeholder="Nhập SĐT..."
                    className={`w-full px-4 py-3 border rounded-xl outline-none transition-all duration-300 backdrop-blur-md text-white placeholder-white/70 shadow-inner ${
                      errors.phone
                        ? "border-red-400 bg-red-500/10 focus:border-red-300"
                        : "border-white/30 bg-white/20 focus:bg-white/30 focus:border-white/60 focus:ring-2 focus:ring-white/20"
                    }`}
                  />
                  {errors.phone && (
                    <p className="absolute -bottom-6 left-0 text-red-300 text-sm font-medium drop-shadow-sm">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <GlassButton
                  type="submit"
                  variant="default"
                  size="md"
                  className="w-full md:w-auto hover:brightness-110 transition-all px-10"
                  textClassName="font-bold text-white drop-shadow-sm"
                >
                  Gửi Thông Tin
                </GlassButton>
              </div>
            </form>
          </div>
        </Glass>

        {/* List Section */}
        <Glass
          variant="default"
          backgroundOpacity={0.15}
          blur={12}
          className="w-full rounded-2xl"
        >
          <div className="w-full p-8">
            <div className="flex justify-between items-center mb-6 border-b border-white/20 pb-4">
              <h2 className="text-2xl font-bold text-white uppercase drop-shadow-md">
                Danh sách sinh viên
              </h2>
              <span className="text-white text-lg font-medium drop-shadow-md">
                Tổng số: {students.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/20 text-white">
                    <th className="py-4 px-4 font-bold uppercase w-16 drop-shadow-sm tracking-wider">
                      STT
                    </th>
                    <th className="py-4 px-4 font-bold uppercase drop-shadow-sm tracking-wider">
                      Tên sinh viên
                    </th>
                    <th className="py-4 px-4 font-bold uppercase drop-shadow-sm tracking-wider">
                      Lớp
                    </th>
                    <th className="py-4 px-4 font-bold uppercase drop-shadow-sm tracking-wider">
                      Địa chỉ
                    </th>
                    <th className="py-4 px-4 font-bold uppercase drop-shadow-sm tracking-wider">
                      SĐT
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {students.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-12 text-white/60 italic text-lg"
                      >
                        Chưa có sinh viên nào
                      </td>
                    </tr>
                  ) : (
                    students.map((student, index) => (
                      <tr
                        key={student.id}
                        className="hover:bg-white/10 transition-colors duration-200 text-white group"
                      >
                        <td className="py-4 px-4 font-medium group-hover:text-yellow-100 transition-colors">
                          {index + 1}
                        </td>
                        <td className="py-4 px-4 font-bold text-lg group-hover:text-yellow-100 transition-colors">
                          {student.name}
                        </td>
                        <td className="py-4 px-4 font-medium">
                          {student.studentClass}
                        </td>
                        <td className="py-4 px-4 font-medium">
                          {student.address}
                        </td>
                        <td className="py-4 px-4 font-medium">
                          {student.phone}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Glass>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50">
          <Toast
            type="success"
            title="Thành công!"
            message="Đã thêm sinh viên mới"
            onClose={() => setShowToast(false)}
            duration={3000}
          />
        </div>
      )}
    </div>
  );
};

export default StudentManager;
