import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { SigninValidation } from "@/lib/validation"
import { Link, useNavigate } from "react-router-dom"

import { useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"

import { useToast } from "@/components/ui/use-toast"
import Loader from "@/components/shared/Loader"
import Logo from "@/components/shared/Logo"

const SigninForm = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext()

  const { mutateAsync: signInAccount } = useSignInAccount()

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    })

    if (!session) {
      return toast({
        variant: "destructive",
        title: "Sign in failed. Please try again.",
      })
    }
    const isLoggedIn = await checkAuthUser()

    if (isLoggedIn) {
      form.reset()

      navigate("/")
    } else {
      return toast({
        variant: "destructive",
        title: "Sign in failed. Please try again.",
      })
    }
  }
  return (
    <Form {...form}>
      <div className="w-full lg:w-fit md:w-fit flex-center flex-col shadow-lg p-10 rounded-lg">
        <div className="hidden xl:block h-1/2">
          <Logo large={false} />
        </div>
        <h2 className="text-lg md:h2-bold">Log in to your account</h2>
        <p className="text-light-3 small-medium md-base-regular">
          Welcome back! Please enter your details.
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3 w-full mt-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-pink-500 text-light-1">
            {isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Submit"
            )}
          </Button>
          <p className="text-small-regular text-dark-4 text-center mt-2">
            Don't have an account?
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1 "
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SigninForm
