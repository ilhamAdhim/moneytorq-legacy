import SignUp from "@/components/supaauth/register";
import { Box } from "@radix-ui/themes";

const AuthRegisterPage = () => {
  return (
    <div className="flex align-center justify-center min-h-[100vh]">
      <Box className="m-auto p-4">
        <SignUp />
      </Box>
    </div>
  );
};

export default AuthRegisterPage;
