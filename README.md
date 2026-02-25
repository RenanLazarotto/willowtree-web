# WillowTree Web

This is my attempt to convert [WillowTree#](https://sourceforge.net/projects/willowtree/) from a C# app to a web one.

## Why?

I don't like either C# or Windows (thanks Microslop for all the AI bullshit!). Also, after a quick look on WillowTree# source code, I was left with the impression that it doesn't do anything special that justifies it being a desktop-only app. So I asked for an LLM model to hallucinate on the WillowTree source code to help me understand it a bit more and now I'm rewriting it as a Svelte app that can be used by anyone (hopefully...)

> [!IMPORTANT]
>
> ## ABOUT AI USAGE
>
> I am using AI on this project because no way in hell I'll learn C# just to port this. I have no time nor patience to do so.
>
> Also I'm doing this entirely on my very sparse free-time, pretty much like everyone else doing cool open-source stuff. Please don't hate me for this lol

> [!Note]
>
> ## About STFS/Xbox stuff
>
> While my idea initially was to reach, from the start, 1:1 feature parity with WillowTree#, I have dropped STFS implementation entirely for the time being.
>
> I'm doing this because I want to focus first on getting it to actually work (which it is kinda doing) and because I haven't found any Xbox 360 saved game file that is in the `.con` format. For now, it'll only work on `.sav` files (hopefully it'll work on consoles saves too).
>
> For the time being, the partial implementation (with possible AI hallucinations) is in [this](cfd05fa4a9e152f45f8ed7c9008d3661d037719b) commit.
