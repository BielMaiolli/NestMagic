import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";



@Schema({
    timestamps: true,
})

export class User {

    @Prop({ required: true })
    name: string;

    @Prop({ unique: true, required: true, message: 'O email já foi utilizado' })
    email: string;

    @Prop({ required: true })
    password: string;

}

export const UserSchema = SchemaFactory.createForClass(User)