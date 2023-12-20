import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { SignupValidation } from "@/lib/validation"
import Loader from "@/components/shared/Loader"
import { Link, useNavigate } from "react-router-dom"

import { useToast } from "@/components/ui/use-toast"
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"
import Logo from "@/components/shared/Logo"

const SignupForm = () => {
  const { toast } = useToast()
  const navigate = useNavigate()

  const { checkAuthUser } = useUserContext()
  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
    useCreateUserAccount()

  const { mutateAsync: signInAccount } = useSignInAccount()

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    const newUser = await createUserAccount(values)
    if (!newUser) {
      return toast({
        title: "Sign up failed. Please try again.",
      })
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    })

    if (!session) {
      return toast({
        title: "Sign in failed. Please try again.",
      })
    }
    const isLoggedIn = await checkAuthUser()

    if (isLoggedIn) {
      form.reset()

      navigate("/")
    } else {
      return toast({ title: "Sign up failed. Please try again." })
    }
  }
  return (
    <Form {...form}>
      <div className="w-full lg:w-fit md:w-fit flex-center shadow-lg px-6 py-4 rounded-lg flex-col">
        <div className="hidden xl:block h-1/2">
          <Logo large={false} />
        </div>
        <h2 className="h3-bold md:h2-bold">Create a new account</h2>
        <p className="text-light-3 small-medium md-base-regular">
          To use social enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3 w-full mt-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            {isCreatingAccount ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Submit"
            )}
          </Button>
          <p className="text-small-regular text-dark-4 text-center mt-2">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1 "
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm
