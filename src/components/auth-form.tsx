"use client";

import { useActionState } from "react";

import { signIn, signUp, type AuthActionState } from "@/app/actions/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const initialState: AuthActionState = {};

export function AuthForm() {
  const [signInState, signInAction, signInPending] = useActionState(
    signIn,
    initialState,
  );
  const [signUpState, signUpAction, signUpPending] = useActionState(
    signUp,
    initialState,
  );

  return (
    <Tabs defaultValue="sign-in" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="sign-in">Sign in</TabsTrigger>
        <TabsTrigger value="sign-up">Create account</TabsTrigger>
      </TabsList>

      <TabsContent value="sign-in">
        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Sign in with the email and password for your workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={signInAction} className="space-y-4">
              <AuthField id="sign-in-email" label="Email" name="email" type="email" />
              <AuthField
                id="sign-in-password"
                label="Password"
                name="password"
                type="password"
              />
              {signInState.error ? (
                <Alert variant="destructive">
                  <AlertDescription>{signInState.error}</AlertDescription>
                </Alert>
              ) : null}
              <Button className="w-full" disabled={signInPending} type="submit">
                {signInPending ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="sign-up">
        <Card>
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>
              Start managing customers and projects in one place.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={signUpAction} className="space-y-4">
              <AuthField id="sign-up-email" label="Email" name="email" type="email" />
              <AuthField
                id="sign-up-password"
                label="Password"
                name="password"
                type="password"
                hint="Use at least 8 characters."
              />
              {signUpState.error ? (
                <Alert variant="destructive">
                  <AlertDescription>{signUpState.error}</AlertDescription>
                </Alert>
              ) : null}
              <Button className="w-full" disabled={signUpPending} type="submit">
                {signUpPending ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function AuthField({
  id,
  label,
  name,
  type,
  hint,
}: {
  id: string;
  label: string;
  name: string;
  type: string;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input autoComplete={name} id={id} name={name} required type={type} />
      {hint ? <p className="text-muted-foreground text-sm">{hint}</p> : null}
    </div>
  );
}
