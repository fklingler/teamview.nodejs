import express from 'express';
import { GraphQLError } from 'graphql';
import { GQC } from 'graphql-compose';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { AuthenticationError } from '../auth/auth-errors';
import logger from '../logger';
import * as account from './graphql-account';
import * as user from './graphql-user';
import * as userRole from './graphql-user-role';

const router = express.Router();

GQC.rootQuery().addFields({
    ...account.QUERIES,
    ...user.QUERIES, ...userRole.QUERIES
});

GQC.rootMutation().addFields({
    ...account.MUTATIONS,
    ...user.MUTATIONS, ...userRole.MUTATIONS
});

const schema = GQC.buildSchema();

//=> Configure the GraphQL API
router.use('/graphql', graphqlExpress(req => {
    return {
        schema,
        debug: false,
        formatError,
        context: { jwt: req.user }
    };
}));

//=> Configure GraphiQL (GUI tool to play with the API)
router.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    passHeader: `'Authorization': 'Bearer ' + localStorage.jwt`
}));

function formatError(error: GraphQLError): GraphQLError {
    (error as any).type = error.originalError.constructor.name;

    if (error.originalError instanceof AuthenticationError) {
        logger.verbose(`graphql: ${error.originalError.constructor.name}:`, error.originalError.message);
    } else {
        logger.error('graphql:', error);
    }

    return error;
}

export default router;
