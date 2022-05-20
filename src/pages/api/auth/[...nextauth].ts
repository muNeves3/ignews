import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { fauna } from '../../../services/fauna';
import { query as q } from 'faunadb'

export default NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            authorization: 'https://github.com/login/oauth/authorize?scope=read:user+user:email',
            token: "https://github.com/login/oauth/access_token",
            checks: 'both',
        }),
    ],
    callbacks: {
        async signIn({user, account, profile}) {
            const { email } = user;
           try {
            await fauna.query(
                q.If(
                    q.Not(
                        q.Exists(
                            q.Match(
                                q.Index('userByEmail'), // Index criado no fauna 
                                q.Casefold(user.email)
                            )
                        )
                    ),
                    q.Create(
                        q.Collection('users'),
                        { data: { email } }
                    ),
                    q.Get(
                        q.Match(
                            q.Index('userByEmail'), // Index criado no fauna 
                            q.Casefold(user.email)
                        )
                    )
                )
            )
            return true
           } catch(e) {
              console.log(e);
              return false;
           }
        },
        jwt: async ({ token, user }) => {
            user && (token.user = user)
            return token;
        },
        session: async ({ session, token }) => {
            session.user = token.user
            return session;
        },
    },
    secret: "secret",
    jwt: {
        secret: "ksdkfsldferSDFSDFSDf",
        
    },

})