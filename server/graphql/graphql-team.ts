import { composeWithMongoose } from 'graphql-compose-mongoose';
import { Team } from '../models';
import {IMongooseTeam} from "../models/team";
import { TYPE_COMPOSER as playerType } from './graphql-player';
import { TYPE_COMPOSER as fixtureType } from './graphql-fixture';

const type = composeWithMongoose(Team);

export const TYPE_COMPOSER = type;

type.addRelation('players', () => ({
    resolver: playerType.get('$findMany'),
    prepareArgs: { _id: (source: IMongooseTeam ) => source.players },
    projection: { players: true }
}));

type.addRelation('fixtures', () => ({
    resolver: fixtureType.get('$findMany'),
    prepareArgs: { _id: (source: IMongooseTeam ) => source.fixtures },
    projection: { fixtures: true }
}));

export const QUERIES = {
    teamById: type.get('$findById'),
    team: type.get('$findOne'),
    teamConnection: type.get('$connection'),
    teams: type.get('$findMany')
};

export const MUTATIONS = {
};

