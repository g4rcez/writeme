import { Heading, Input, InputProps, SiteContainer, Text } from "components";
import { Divider } from "components/divider";
import { Database } from "db/database";
import { httpClient } from "lib/http-client";
import { Strings } from "lib/strings";
import { GetStaticProps } from "next";
import Router from "next/router";
import React, { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { BsPlusCircle } from "react-icons/bs";

export const getStaticProps: GetStaticProps = async () => {
  const groups = await Database.allGroups();
  return {
    props: { groups },
    revalidate: 10,
  };
};

type Props = {
  groups: Database.Group[];
};

const SubInfo = ({ children }: PropsWithChildren) => (
  <p className="my-2 antialiased text-text-paragraph lining-nums whitespace-pre-wrap break-words w-full text-left leading-relaxed">
    {children}
  </p>
);

const Field: React.VFC<
  Omit<InputProps, "ref"> & {
    value: string;
    title: string;
    name: string;
    autoFocus?: boolean;
  }
> = (props) => {
  return (
    <label className="flex gap-x-2 items-center">
      <b>{props.title}:</b>
      <Input
        {...props}
        type={props.type}
        autoFocus={props.autoFocus}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
      />
    </label>
  );
};

const initialGroupFormState = { title: "", slug: "", id: "", position: "" };

type State = typeof initialGroupFormState;

export const GroupForm: React.VFC<{ group: State | null }> = (props) => {
  const [group, setGroup] = useState(() => props.group ?? initialGroupFormState);

  useEffect(() => {
    return setGroup(props.group ?? initialGroupFormState);
  }, [props.group]);

  const onChange: InputProps["onChange"] = (event) => {
    const name = event.currentTarget.name;
    const value = event.currentTarget.value;
    setGroup((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await httpClient.put("/group", { ...group, position: Number.parseInt(group.position) });
      console.log(response.data);
      Router.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="w-full flex-wrap flex gap-x-8">
      <form className="w-full flex gap-4 justify-between flex-wrap" onSubmit={onSubmit}>
        <Field autoFocus name="title" title="Title" value={group.title} onChange={onChange} />
        <Field name="slug" title="Slug route" value={group.slug} onChange={onChange} />
        <Field
          type="number"
          min={0}
          step={1}
          name="position"
          title="Position"
          value={group.position}
          onChange={onChange}
        />
        <button type="submit" className="button">
          Create
        </button>
      </form>
      <div className="mt-4">
        <p>
          <b className="mr-4">How to access documents:</b>
          <a className="link" href="#">
            {Strings.concatUrl("/docs", Strings.slug(group.slug), "[document-name]")}
          </a>
        </p>
      </div>
    </section>
  );
};

export default function DashboardGroup(props: Props) {
  const [show, setShow] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<State | null>(null);

  const toggle = () => setShow((prev) => !prev);

  const select = useCallback((state: State) => {
    setCurrentSelection(state);
    setShow(true);
  }, []);

  useEffect(() => {
    if (!show) setCurrentSelection(null);
  }, [show]);

  return (
    <SiteContainer className="w-full">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <Heading className="text-5xl" tag="h1">
            Groups
          </Heading>
          <button onClick={toggle} className="button h-fit flex items-center gap-x-2">
            <BsPlusCircle />
            New Group
          </button>
        </div>
        <Text>Center of writeme groups for your documents</Text>
      </header>
      {show && (
        <section className="flex flex-col items-center my-4">
          <Divider />
          <section className="w-full my-4">
            <GroupForm group={currentSelection} />
          </section>
          <Divider />
        </section>
      )}
      <section className="w-full flex gap-8">
        {props.groups.map((group) => (
          <button
            key={`${group.id}-key`}
            onClick={() =>
              select({ id: group.id, slug: group.slug, title: group.title, position: `${group.position}` })
            }
            className="flex flex-col items-start justify-start border border-border-neutral p-4 rounded"
          >
            <Heading tag="h3" className="text-xl">
              {group.title}
            </Heading>
            <Divider />
            <SubInfo>
              <b>Slug:</b> {group.slug}
            </SubInfo>
            <SubInfo>
              <b>Updated At: </b>
              <time>{group.updatedAt.toISOString()}</time>
            </SubInfo>
          </button>
        ))}
      </section>
    </SiteContainer>
  );
}
